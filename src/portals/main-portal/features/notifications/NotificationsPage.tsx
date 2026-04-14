import { useEffect } from "react";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { useAuth } from "../../../../hooks/useAuth";
import { useNotificationsStore } from "../../../../store/notifications.store";
import { useTranslation } from "react-i18next";

export function NotificationsPage() {
  const { user } = useAuth();
  const { t } = useTranslation("translation");
  const spaceId = user?.activeSpaceId;

  const items = useNotificationsStore((s) => s.items);
  const loading = useNotificationsStore((s) => s.loading);
  const error = useNotificationsStore((s) => s.error);
  const refresh = useNotificationsStore((s) => s.refresh);
  const markRead = useNotificationsStore((s) => s.markRead);

  useEffect(() => {
    void refresh(spaceId);
  }, [refresh, spaceId]);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text">{t("pages.notifications.title")}</h2>
        <Button variant="outline" disabled={loading} onClick={() => void refresh(spaceId)}>
          {t("common.refresh")}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-3 text-sm text-muted">{t("common.loading")}</p> : null}

      <div className="mt-4 grid gap-3">
        {items.map((n) => (
          <Card key={n.id} className={n.read ? "p-4 opacity-70" : "p-4"}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold text-text">
                  <span className="text-muted">[{n.type}]</span> {n.title}
                </div>
                <p className="mt-2 text-sm text-text">{n.message}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">{n.createdAt}</span>
              {!n.read ? (
                <Button variant="ghost" onClick={() => void markRead(n.id)}>
                  {t("common.markRead")}
                </Button>
              ) : null}
              {n.href ? (
                <a className="text-sm text-primary hover:underline" href={n.href}>
                  {t("common.open")}
                </a>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
