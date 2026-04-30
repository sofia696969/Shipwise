import { useEffect } from "react";
import { useRouter } from "next/router";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultAuthorizedRoute, hasPermission, PERMISSIONS, type Permission } from "@/lib/rbac";

export default function PostLoginPage() {
  const router = useRouter();
  const { user, appUser, loading, roleResolved } = useAuth();

  useEffect(() => {
    if (loading || !roleResolved) return;

    // 1. AUTH GATE
    if (!user) {
      router.replace("/auth");
      return;
    }

    // 2. PROFILE / ONBOARDING GATE
    if (!appUser) {
      router.replace("/request-access");
      return;
    }

    const requestedPath =
      typeof router.query.next === "string" &&
      router.query.next.startsWith("/")
        ? router.query.next
        : null;

    const canAccess = (permission: Permission) =>
      hasPermission(appUser, permission);

    // 3. REQUESTED PATH VALIDATION (only if safe)

    if (requestedPath) {
      const isSuperadmin = requestedPath.startsWith("/superadmin/");
      const isHR =
        requestedPath === "/hr" || requestedPath === "/usermanagement";

      const isOps =
        requestedPath === "/dashboard" ||
        requestedPath === "/shipments" ||
        requestedPath === "/goods" ||
        requestedPath === "/carriers" ||
        requestedPath === "/incidents" ||
        requestedPath === "/notifications";

      if (isSuperadmin) {
        if (canAccess(PERMISSIONS.SUPERADMIN_PORTAL_ACCESS)) {
          router.replace(requestedPath);
          return;
        }
      }

      if (isHR) {
        if (canAccess(PERMISSIONS.HR_PORTAL_ACCESS)) {
          router.replace(requestedPath);
          return;
        }
      }

      if (isOps) {
        if (canAccess(PERMISSIONS.OPERATIONS_PORTAL_ACCESS)) {
          router.replace(requestedPath);
          return;
        }
      }
    }

    // 4. DEFAULT FALLBACK (ROLE-BASED ROUTE)
    router.replace(getDefaultAuthorizedRoute(appUser));
  }, [user, appUser, loading, roleResolved, router]);

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-12 text-slate-100">
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
        <ShipwiseLogo className="!items-center" showStaffBadge={false} />

        <div className="mt-8 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />

        <p className="mt-6 text-sm text-slate-300">
          Finalizing your workspace access...
        </p>
      </div>
    </main>
  );
}