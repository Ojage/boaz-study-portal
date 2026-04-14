export const PATHS = {
  root: "/",
  login: "/login",
  notFound: "/404",
  app: {
    root: "/app",
    proofs: "/app/proofs",
    wallet: "/app/wallet",
    affiliation: "/app/affiliation",
    invoices: "/app/invoices",
    settings: "/app/settings",
    financingNew: "/app/financing/new",
    subscribe: {
      root: "/app/subscribe",
    },
    subscriptions: {
      root: "/app/subscriptions",
      services: "/app/subscriptions/services",
      financing: "/app/subscriptions/financing",
      repayments: "/app/subscriptions/repayments",
    },
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
    proofs: "proofs",
    wallet: "wallet",
    affiliation: "affiliation",
    invoices: "invoices",
    settings: "settings",
    financingNew: "financing/new",
    subscribe: "subscribe/:serviceId",
    subscriptions: {
      root: "subscriptions",
      services: "subscriptions/services",
      financing: "subscriptions/financing",
      repayments: "subscriptions/repayments",
    },
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
