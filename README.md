# StudyPortal (BOAZ-STUDY Technical Test)

Frontend technical test project for a **React + TypeScript** developer role. The goal is to build a multi-space student portal UI with:

- **Backend independence** via TypeScript contracts + mocks
- **Scopes/authorities-based permissions** (not roles-based UI checks)
- Professional architecture (modular portals/features)

## Run

```bash
pnpm i
pnpm dev
```

## Mock Authentication (Phase 1)

The app currently uses a mocked login that **simulates a JWT**. The generated token contains an `authorities: string[]` array (used by `usePermissions`) and a `roles: string[]` array for reference only.

Login UI uses the BOAZ-STUDY logo at `src/assets/images/boaz_logo.png`.

### Available Mock Profiles

You can log in using **username or email** + password.

| Profile | Username | Email | Password | Roles (reference) | Testable permissions (`authorities[]`) |
|---|---|---|---|---|---|
| `ADMIN` | `admin` | `admin.portal@boaz-study.com` | `BoazStudy@2026!` | `ADMIN` | `ticket:create`, `ticket:read`, `ticket:update`, `ticket:delete`, `document:create`, `document:read`, `document:update`, `document:delete`, `notification:read`, `notification:manage` |
| `JOHN_DOE` | `john.doe` | `john.doe@boaz-study.com` | `JohnDoe@2026!` | `AGENT`, `USER` | `ticket:read`, `ticket:update`, `document:read`, `notification:read` |
| `USER` | `user` | `jane.student@boaz-study.com` | `Student@2026!` | `USER` | `ticket:create`, `ticket:read`, `document:read`, `notification:read` |

**Note:** Permissions are enforced through the `authorities[]` claim (see `src/hooks/usePermissions.ts` and `src/components/ProtectedComponent.tsx`).

## Internationalization (EN/FR)

The UI supports **English** and **French**.

- Initialization: `src/i18n/init.ts`
- Typed translation resources: `src/i18n/en.ts` and `src/i18n/fr.ts`
- Language persistence: `localStorage` key `studyportal.language`
- UI switcher: `src/components/shared/LanguageToggle.tsx`

## Product flow diagrams (spec)

Flow diagrams for the described student + admin portal are documented in `docs/app-flows.md`.
# boaz-study-portal
