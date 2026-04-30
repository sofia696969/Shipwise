import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuthContext } from "@/lib/serverAuth";

export const ROLES = {
  SUPERADMIN: "superadmin",
  HR: "hr",
  MANAGER: "manager",
  STAFF: "staff",
} as const;

export const PERMISSIONS = {
  SUPERADMIN_PORTAL_ACCESS: "superadmin.portal.access",
  HR_PORTAL_ACCESS: "hr.portal.access",
  OPERATIONS_PORTAL_ACCESS: "operations.portal.access",
  ORGANIZATION_PROFILE_MANAGE: "organization.profile.manage",
  USERS_MANAGE: "users.manage",
  ORGANIZATION_REQUESTS_READ: "organization_requests.read",
  ORGANIZATION_REQUESTS_DECIDE: "organization_requests.decide",
  ORGANIZATION_REQUESTS_SUBMIT: "organization_requests.submit",
  SHIPMENTS_READ: "shipments.read",
  SHIPMENTS_WRITE: "shipments.write",
  GOODS_READ: "goods.read",
  CARRIERS_READ: "carriers.read",
  CARRIERS_WRITE: "carriers.write",
  INCIDENTS_READ: "incidents.read",
  INCIDENTS_WRITE: "incidents.write",
  AUDIT_LOGS_READ: "audit_logs.read",
  NOTIFICATIONS_READ: "notifications.read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type EffectiveRole = "superadmin" | "hr" | "manager" | "staff" | "unknown";
export type AssignableRole = typeof ROLES.HR | typeof ROLES.MANAGER | typeof ROLES.STAFF;

export type RbacUser = {
  role?: string | null;
  is_super_admin?: boolean | null;
  organization_id?: string | null;
};

const ROLE_PERMISSIONS: Record<EffectiveRole, ReadonlySet<Permission>> = {
  superadmin: new Set<Permission>([
    PERMISSIONS.SUPERADMIN_PORTAL_ACCESS,
    PERMISSIONS.ORGANIZATION_REQUESTS_READ,
    PERMISSIONS.ORGANIZATION_REQUESTS_DECIDE,
    PERMISSIONS.AUDIT_LOGS_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
  ]),
  hr: new Set<Permission>([
    PERMISSIONS.HR_PORTAL_ACCESS,
    PERMISSIONS.ORGANIZATION_PROFILE_MANAGE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ORGANIZATION_REQUESTS_SUBMIT,
    PERMISSIONS.AUDIT_LOGS_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
  ]),
  manager: new Set<Permission>([
    PERMISSIONS.OPERATIONS_PORTAL_ACCESS,
    PERMISSIONS.SHIPMENTS_READ,
    PERMISSIONS.GOODS_READ,
    PERMISSIONS.CARRIERS_READ,
    PERMISSIONS.INCIDENTS_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.ORGANIZATION_REQUESTS_SUBMIT,
  ]),
  staff: new Set<Permission>([
    PERMISSIONS.OPERATIONS_PORTAL_ACCESS,
    PERMISSIONS.SHIPMENTS_READ,
    PERMISSIONS.SHIPMENTS_WRITE,
    PERMISSIONS.GOODS_READ,
    PERMISSIONS.CARRIERS_READ,
    PERMISSIONS.CARRIERS_WRITE,
    PERMISSIONS.INCIDENTS_READ,
    PERMISSIONS.INCIDENTS_WRITE,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.ORGANIZATION_REQUESTS_SUBMIT,
  ]),
  unknown: new Set<Permission>([
    PERMISSIONS.ORGANIZATION_REQUESTS_SUBMIT,
    PERMISSIONS.NOTIFICATIONS_READ,
  ]),
};

export function getEffectiveRole(user: RbacUser | null | undefined): EffectiveRole {
  if (user?.is_super_admin === true) return "superadmin";
  if (user?.role === "hr") return "hr";
  if (user?.role === "manager") return "manager";
  if (user?.role === "staff") return "staff";
  return "unknown";
}

export function hasPermission(
  user: RbacUser | null | undefined,
  permission: Permission,
): boolean {
  const role = getEffectiveRole(user);
  return ROLE_PERMISSIONS[role].has(permission);
}

export function getDefaultAuthorizedRoute(user: RbacUser | null | undefined): string {
  if (hasPermission(user, PERMISSIONS.SUPERADMIN_PORTAL_ACCESS)) {
    return "/superadmin/requests";
  }
  if (hasPermission(user, PERMISSIONS.HR_PORTAL_ACCESS)) {
    return "/hr";
  }
  if (hasPermission(user, PERMISSIONS.OPERATIONS_PORTAL_ACCESS)) {
    return "/dashboard";
  }
  return "/post-login";
}

type ApiAuthContext = Awaited<ReturnType<typeof requireAuthContext>>;

type ApiGuardResult = {
  ctx: NonNullable<ApiAuthContext>;
};

export async function requireApiPermission(
  req: NextApiRequest,
  res: NextApiResponse,
  permission: Permission,
  options?: { requireOrganization?: boolean },
): Promise<ApiGuardResult | null> {
  const ctx = await requireAuthContext(req, res);
  if (!ctx) return null;

  if (!hasPermission(ctx.user, permission)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  if (options?.requireOrganization && !ctx.user.organization_id) {
    res.status(403).json({ error: "No organization assigned to current user" });
    return null;
  }

  return { ctx };
}
