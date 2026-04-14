import { useEffect, useMemo, useState } from "react";
import type { Ticket } from "../../../../contracts/api-contracts";
import { ProtectedComponent } from "../../../../components/ProtectedComponent";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { useAuth } from "../../../../hooks/useAuth";
import { mockCreateTicket, mockListTickets } from "../../../../services/mock/tickets.mock";
import { useTranslation } from "react-i18next";

export function TicketsPage() {
  const { user } = useAuth();
  const { t } = useTranslation("translation");
  const spaceId = user?.activeSpaceId;
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canCreate = useMemo(() => Boolean(userId && spaceId), [spaceId, userId]);

  useEffect(() => {
    if (!spaceId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    void mockListTickets({ spaceId })
      .then((res) => {
        if (!mounted) return;
        setItems(res.data);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setLoading(false);
        setError(e instanceof Error ? e.message : "Failed to load tickets");
      });
    return () => {
      mounted = false;
    };
  }, [spaceId]);

  async function createQuickTicket() {
    if (!canCreate || !userId || !spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await mockCreateTicket({
        title: t("pages.tickets.quickTitle"),
        description: t("pages.tickets.quickDescription"),
        priority: "LOW",
        spaceId,
        createdByUserId: userId,
      });
      setItems((prev) => [res.data, ...prev]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text">{t("pages.tickets.title")}</h2>
        <ProtectedComponent permissions="ticket:create">
          <Button disabled={!canCreate || loading} onClick={() => void createQuickTicket()}>
            {t("pages.tickets.create")}
          </Button>
        </ProtectedComponent>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-3 text-sm text-muted">{t("common.loading")}</p> : null}

      <div className="mt-4 grid gap-3">
        {items.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold text-text">{t.title}</div>
                <div className="mt-1 text-xs text-muted">
                  {t.status} • {t.priority} • {t.id}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-text">{t.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
