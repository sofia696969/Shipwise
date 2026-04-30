import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { getDefaultAuthorizedRoute, hasPermission, type Permission, type RbacUser } from "@/lib/rbac";

type UsePagePermissionArgs = {
  loading: boolean;
  roleResolved?: boolean;
  isAuthenticated: boolean;
  user: RbacUser | null | undefined;
  requiredPermission: Permission;
};

export function usePagePermission({
  loading,
  roleResolved = true,
  isAuthenticated,
  user,
  requiredPermission,
}: UsePagePermissionArgs) {
  const router = useRouter();
  const allowed = useMemo(
    () => hasPermission(user, requiredPermission),
    [requiredPermission, user],
  );

  useEffect(() => {
    if (loading || !roleResolved) return;
    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }
    if (!allowed) {
      router.replace(getDefaultAuthorizedRoute(user));
    }
  }, [allowed, isAuthenticated, loading, roleResolved, router, user]);

  return { allowed };
}
