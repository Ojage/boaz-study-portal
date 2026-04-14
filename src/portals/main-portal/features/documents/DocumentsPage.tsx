import { useEffect, useMemo, useState } from "react";
import type { Document } from "../../../../contracts/api-contracts";
import { ProtectedComponent } from "../../../../components/ProtectedComponent";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { useAuth } from "../../../../hooks/useAuth";
import { mockListDocuments, mockUploadDocument } from "../../../../services/mock/documents.mock";
import { useTranslation } from "react-i18next";

export function DocumentsPage() {
  const { user } = useAuth();
  const { t } = useTranslation("translation");
  const spaceId = user?.activeSpaceId;
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canUpload = useMemo(() => Boolean(userId && spaceId), [spaceId, userId]);

  useEffect(() => {
    if (!spaceId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    void mockListDocuments({ spaceId })
      .then((res) => {
        if (!mounted) return;
        setItems(res.data);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setLoading(false);
        setError(e instanceof Error ? e.message : "Failed to load documents");
      });
    return () => {
      mounted = false;
    };
  }, [spaceId]);

  async function uploadQuickDocument() {
    if (!canUpload || !userId || !spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await mockUploadDocument({
        name: t("pages.documents.quickName"),
        mimeType: "text/plain",
        sizeBytes: 123,
        visibility: "SPACE",
        spaceId,
        uploadedByUserId: userId,
      });
      setItems((prev) => [res.data, ...prev]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to upload document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text">{t("pages.documents.title")}</h2>
        <ProtectedComponent permissions="document:create">
          <Button variant="primary" disabled={!canUpload || loading} onClick={() => void uploadQuickDocument()}>
            {t("pages.documents.upload")}
          </Button>
        </ProtectedComponent>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-3 text-sm text-muted">{t("common.loading")}</p> : null}

      <div className="mt-4 grid gap-3">
        {items.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold text-text">{d.name}</div>
                <div className="mt-1 text-xs text-muted">
                  {d.visibility} • {(d.sizeBytes / 1024).toFixed(1)} KB • {d.id}
                </div>
              </div>
            </div>
            <a className="mt-3 inline-flex text-sm text-primary hover:underline" href={d.url}>
              {d.url}
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}
