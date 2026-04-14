import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { PATHS, SEGMENTS } from "./paths";
import { RouteErrorElement } from "./RouteErrorElement";
import { RequireAuth, RequirePermission } from "../components/shared";
import { LoginPage } from "../portals/auth-portal/LoginPage";
import { MainLayout } from "../portals/main-portal/MainLayout";
import { TicketsPage } from "../portals/main-portal/features/tickets/TicketsPage";
import { DocumentsPage } from "../portals/main-portal/features/documents/DocumentsPage";
import { NotificationsPage } from "../portals/main-portal/features/notifications/NotificationsPage";
import { AdminLayout } from "../portals/admin-portal/AdminLayout";
import { AdminHomePage } from "../portals/admin-portal/pages/AdminHomePage";
import { PlaceholderPage } from "../portals/admin-portal/pages/PlaceholderPage";
import { ProfilePage } from "../portals/admin-portal/pages/ProfilePage";
export const router = createBrowserRouter([
  {
    id: "root",
    path: PATHS.root,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <Navigate to={PATHS.app.root} replace /> },
      { id: "login", path: PATHS.login, element: <LoginPage /> },

      {
        id: "app",
        path: PATHS.app.root,
        element: (
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to={PATHS.app.tickets} replace /> },
          { id: "app.tickets", path: SEGMENTS.app.tickets, element: <TicketsPage /> },
          { id: "app.documents", path: SEGMENTS.app.documents, element: <DocumentsPage /> },
          { id: "app.notifications", path: SEGMENTS.app.notifications, element: <NotificationsPage /> },
        ],
      },

      {
        id: "admin",
        path: PATHS.admin.root,
        element: (
          <RequireAuth>
            <RequirePermission permissions={["ticket:delete"]}>
              <AdminLayout />
            </RequirePermission>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <AdminHomePage /> },
          { id: "admin.profile", path: SEGMENTS.admin.profile, element: <ProfilePage /> },
          { id: "admin.settings", path: SEGMENTS.admin.settings, element: <PlaceholderPage titleKey="admin.titles.settings" /> },
          { id: "admin.dashboard", path: SEGMENTS.admin.dashboard, element: <PlaceholderPage titleKey="admin.titles.dashboard" /> },
          { id: "admin.services", path: SEGMENTS.admin.services, element: <PlaceholderPage titleKey="admin.titles.services" /> },
          { id: "admin.subscriptions", path: SEGMENTS.admin.subscriptions, element: <PlaceholderPage titleKey="admin.titles.subscriptions" /> },
          { id: "admin.organization", path: SEGMENTS.admin.organization, element: <PlaceholderPage titleKey="admin.titles.organization" /> },
          { id: "admin.proofs", path: SEGMENTS.admin.proofs, element: <PlaceholderPage titleKey="admin.titles.proofs" /> },
          { id: "admin.affiliation", path: SEGMENTS.admin.affiliation, element: <PlaceholderPage titleKey="admin.titles.affiliation" /> },
        ],
      },

      { path: "*", element: <Navigate to={PATHS.app.root} replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
