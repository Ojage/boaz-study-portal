import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { PATHS, SEGMENTS } from "./paths";
import { RouteErrorElement } from "./RouteErrorElement";
import { RequireAuth, RequirePermission } from "../components/shared";
import { LoginPage } from "../portals/auth-portal/LoginPage";
import { MainLayout } from "../portals/main-portal/MainLayout";
import { AdminLayout } from "../portals/admin-portal/AdminLayout";
import { AdminHomePage } from "../portals/admin-portal/pages/AdminHomePage";
import { PlaceholderPage } from "../portals/admin-portal/pages/PlaceholderPage";
import { ProfilePage } from "../portals/admin-portal/pages/ProfilePage";
import { AdminSubscriptionsPage } from "../portals/admin-portal/pages/AdminSubscriptionsPage";
import { AdminProofsPage } from "../portals/admin-portal/pages/AdminProofsPage";
import { NotFoundPage } from "../components/shared/NotFoundPage";
import { HomePage } from "../portals/main-portal/pages/HomePage";
import { SubscriptionsServicesPage } from "../portals/main-portal/pages/SubscriptionsServicesPage";
import { SubscriptionsFinancingPage } from "../portals/main-portal/pages/SubscriptionsFinancingPage";
import { SubscriptionsRepaymentsPage } from "../portals/main-portal/pages/SubscriptionsRepaymentsPage";
import { ProofsPage } from "../portals/main-portal/pages/ProofsPage";
import { WalletPage } from "../portals/main-portal/pages/WalletPage";
import { AffiliationPage } from "../portals/main-portal/pages/AffiliationPage";
import { InvoicesPage } from "../portals/main-portal/pages/InvoicesPage";
import { SettingsPage } from "../portals/main-portal/pages/SettingsPage";
import { SubscribeWizardPage } from "../portals/main-portal/pages/SubscribeWizardPage";
import { FinancingWizardPage } from "../portals/main-portal/pages/FinancingWizardPage";
export const router = createBrowserRouter([
  {
    id: "root",
    path: PATHS.root,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <Navigate to={PATHS.app.root} replace /> },
      { id: "login", path: PATHS.login, element: <LoginPage /> },
      { id: "notFound", path: PATHS.notFound, element: <NotFoundPage /> },

      {
        id: "app",
        path: PATHS.app.root,
        element: (
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <HomePage /> },

          { id: "app.subscriptions.services", path: SEGMENTS.app.subscriptions.services, element: <SubscriptionsServicesPage /> },
          { id: "app.subscriptions.financing", path: SEGMENTS.app.subscriptions.financing, element: <SubscriptionsFinancingPage /> },
          { id: "app.subscriptions.repayments", path: SEGMENTS.app.subscriptions.repayments, element: <SubscriptionsRepaymentsPage /> },

          { id: "app.proofs", path: SEGMENTS.app.proofs, element: <ProofsPage /> },
          { id: "app.wallet", path: SEGMENTS.app.wallet, element: <WalletPage /> },
          { id: "app.affiliation", path: SEGMENTS.app.affiliation, element: <AffiliationPage /> },
          { id: "app.invoices", path: SEGMENTS.app.invoices, element: <InvoicesPage /> },
          { id: "app.settings", path: SEGMENTS.app.settings, element: <SettingsPage /> },

          { id: "app.subscribe", path: SEGMENTS.app.subscribe, element: <SubscribeWizardPage /> },
          { id: "app.financing.new", path: SEGMENTS.app.financingNew, element: <FinancingWizardPage /> },
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
          { id: "admin.subscriptions", path: SEGMENTS.admin.subscriptions, element: <AdminSubscriptionsPage /> },
          { id: "admin.organization", path: SEGMENTS.admin.organization, element: <PlaceholderPage titleKey="admin.titles.organization" /> },
          { id: "admin.proofs", path: SEGMENTS.admin.proofs, element: <AdminProofsPage /> },
          { id: "admin.affiliation", path: SEGMENTS.admin.affiliation, element: <PlaceholderPage titleKey="admin.titles.affiliation" /> },
        ],
      },

      { path: "*", element: <Navigate to={PATHS.notFound} replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
