import type { ApiResponse, AuthUser } from "../../contracts/api-contracts";
import { createUnsignedJwt, parseJwtPayload } from "../../utils/jwt";
import { toApiResponse, withDelay } from "./mock-utils";

export type MockProfile = "ADMIN" | "JOHN_DOE" | "USER";

export interface MockAuthSession {
  token: string;
  user: AuthUser;
}

export interface MockProfileInfo {
  code: MockProfile;
  label: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  authorities: string[];
  user: AuthUser;
}

const SPACE_SCIENCE = "space-science";
const SPACE_ENGINEERING = "space-engineering";

const ADMIN_AUTHORITIES: string[] = [
  "ticket:create",
  "ticket:read",
  "ticket:update",
  "ticket:delete",
  "document:create",
  "document:read",
  "document:update",
  "document:delete",
  "notification:read",
  "notification:manage",
];

const USER_AUTHORITIES: string[] = [
  "ticket:create",
  "ticket:read",
  "document:read",
  "notification:read",
];

const AGENT_AUTHORITIES: string[] = [
  "ticket:read",
  "ticket:update",
  "document:read",
  "notification:read",
];

export const ADMIN_USER: AuthUser = {
  id: "user-admin-001",
  username: "admin",
  fullName: "Ada Admin",
  email: "admin.portal@boaz-study.com",
  authorities: ADMIN_AUTHORITIES,
  activeSpaceId: SPACE_SCIENCE,
  spaceIds: [SPACE_SCIENCE, SPACE_ENGINEERING],
};

export const JOHN_DOE_USER: AuthUser = {
  id: "user-john-001",
  username: "john.doe",
  fullName: "John Doe",
  email: "john.doe@boaz-study.com",
  authorities: AGENT_AUTHORITIES,
  activeSpaceId: SPACE_SCIENCE,
  spaceIds: [SPACE_SCIENCE],
};

export const STANDARD_USER: AuthUser = {
  id: "user-std-001",
  username: "user",
  fullName: "Jane Student",
  email: "jane.student@boaz-study.com",
  authorities: USER_AUTHORITIES,
  activeSpaceId: SPACE_SCIENCE,
  spaceIds: [SPACE_SCIENCE],
};

const PROFILE_INFO: Record<MockProfile, Omit<MockProfileInfo, "user" | "authorities"> & { authorities: string[] }> = {
  ADMIN: {
    code: "ADMIN",
    label: "Administrator",
    username: "admin",
    email: "admin.portal@boaz-study.com",
    password: "BoazStudy@2026!",
    roles: ["ADMIN"],
    authorities: ADMIN_AUTHORITIES,
  },
  JOHN_DOE: {
    code: "JOHN_DOE",
    label: "Agent (reference user)",
    username: "john.doe",
    email: "john.doe@boaz-study.com",
    password: "JohnDoe@2026!",
    roles: ["AGENT", "USER"],
    authorities: AGENT_AUTHORITIES,
  },
  USER: {
    code: "USER",
    label: "Basic user",
    username: "user",
    email: "jane.student@boaz-study.com",
    password: "Student@2026!",
    roles: ["USER"],
    authorities: USER_AUTHORITIES,
  },
};

export const MOCK_PROFILES: MockProfileInfo[] = [
  {
    ...PROFILE_INFO.ADMIN,
    user: ADMIN_USER,
  },
  {
    ...PROFILE_INFO.JOHN_DOE,
    user: JOHN_DOE_USER,
  },
  {
    ...PROFILE_INFO.USER,
    user: STANDARD_USER,
  },
];

function buildMockToken(user: AuthUser, roles: string[]): string {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    sub: user.id,
    preferred_username: user.username,
    name: user.fullName,
    email: user.email,
    roles,
    authorities: user.authorities,
    active_space_id: user.activeSpaceId,
    space_ids: user.spaceIds,
    iat: nowSeconds,
    exp: nowSeconds + 60 * 60,
  };

  return createUnsignedJwt(payload);
}

function profileToUser(profile: MockProfile): AuthUser {
  if (profile === "ADMIN") return ADMIN_USER;
  if (profile === "JOHN_DOE") return JOHN_DOE_USER;
  return STANDARD_USER;
}

export async function mockLogin(
  profile: MockProfile,
  delayMs?: number,
): Promise<ApiResponse<MockAuthSession>> {
  return await withDelay(() => {
    const info = PROFILE_INFO[profile];
    const user = profileToUser(profile);
    const token = buildMockToken(user, info.roles);
    return toApiResponse(
      { token, user },
      `Mock login successful (${profile})`,
    );
  }, delayMs);
}

export async function mockLoginWithCredentials(
  params: { login: string; password: string },
  delayMs?: number,
): Promise<ApiResponse<MockAuthSession>> {
  return await withDelay(() => {
    const login = params.login.trim().toLowerCase();
    const password = params.password;

    const match = MOCK_PROFILES.find(
      (p) =>
        (p.username.toLowerCase() === login || p.email.toLowerCase() === login) &&
        p.password === password,
    );

    if (!match) {
      throw new Error("Invalid credentials");
    }

    const token = buildMockToken(match.user, match.roles);
    return toApiResponse({ token, user: match.user }, `Mock login successful (${match.code})`);
  }, delayMs);
}

export async function mockMe(
  token: string,
  delayMs?: number,
): Promise<ApiResponse<AuthUser | null>> {
  return await withDelay(() => {
    const payload = parseJwtPayload(token);
    const preferredUsername = payload?.preferred_username;
    if (preferredUsername === ADMIN_USER.username) return toApiResponse(ADMIN_USER, "Mock session resolved");
    if (preferredUsername === JOHN_DOE_USER.username) return toApiResponse(JOHN_DOE_USER, "Mock session resolved");
    if (preferredUsername === STANDARD_USER.username) return toApiResponse(STANDARD_USER, "Mock session resolved");
    return toApiResponse(null, "Mock session not found");
  }, delayMs);
}
