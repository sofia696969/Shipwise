import { PERMISSIONS, getDefaultAuthorizedRoute, hasPermission } from "@/lib/rbac";

export { getDefaultAuthorizedRoute };

export function canAccessSuperadmin(
  user: { role?: string | null; is_super_admin?: boolean | null } | null | undefined,
) {
  return hasPermission(user, PERMISSIONS.SUPERADMIN_PORTAL_ACCESS);
}

export function isHrUser(
  user: { role?: string | null; is_super_admin?: boolean | null } | null | undefined,
) {
  return hasPermission(user, PERMISSIONS.HR_PORTAL_ACCESS);
}

export function canAccessOperationalViews(
  user: { role?: string | null; is_super_admin?: boolean | null } | null | undefined,
) {
  return hasPermission(user, PERMISSIONS.OPERATIONS_PORTAL_ACCESS);
}

export function canManageOrgUsers(
  user: { role?: string | null; is_super_admin?: boolean | null } | null | undefined,
) {
  return hasPermission(user, PERMISSIONS.USERS_MANAGE);
}