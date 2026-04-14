export const PATHS = {
  root: "/",
  login: "/login",
  app: {
    root: "/app",
    tickets: "/app/tickets",
    documents: "/app/documents",
    notifications: "/app/notifications",
  },
  admin: {
    root: "/admin",
    profile: "/admin/profile",
    dashboard: "/admin/dashboard",
    settings: "/admin/settings",
    services: "/admin/services",
    subscriptions: "/admin/subscriptions",
    organization: "/admin/organization",
    proofs: "/admin/proofs",
    affiliation: "/admin/affiliation",
  },
} as const;

export const SEGMENTS = {
  app: {
    tickets: "tickets",
    documents: "documents",
    notifications: "notifications",
  },
  admin: {
    profile: "profile",
    dashboard: "dashboard",
    settings: "settings",
    services: "services",
    subscriptions: "subscriptions",
    organization: "organization",
    proofs: "proofs",
    affiliation: "affiliation",
  },
} as const;

export function isAppRoute(pathname: string): boolean {
  return pathname === PATHS.app.root || pathname.startsWith(`${PATHS.app.root}/`);
}

export function isAdminRoute(pathname: string): boolean {
  return pathname === PATHS.admin.root || pathname.startsWith(`${PATHS.admin.root}/`);
}
