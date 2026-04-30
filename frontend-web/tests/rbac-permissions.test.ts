import { describe, expect, it } from "vitest";
import { PERMISSIONS, getDefaultAuthorizedRoute, hasPermission } from "@/lib/rbac";

describe("RBAC permissions matrix", () => {
  const superadmin = { role: "staff", is_super_admin: true };
  const hr = { role: "hr", is_super_admin: false };
  const manager = { role: "manager", is_super_admin: false };
  const staff = { role: "staff", is_super_admin: false };

  it("routes users to correct default pages", () => {
    expect(getDefaultAuthorizedRoute(superadmin)).toBe("/superadmin/requests");
    expect(getDefaultAuthorizedRoute(hr)).toBe("/hr");
    expect(getDefaultAuthorizedRoute(manager)).toBe("/dashboard");
    expect(getDefaultAuthorizedRoute(staff)).toBe("/dashboard");
  });

  it("enforces users.manage only for hr", () => {
    expect(hasPermission(hr, PERMISSIONS.USERS_MANAGE)).toBe(true);
    expect(hasPermission(manager, PERMISSIONS.USERS_MANAGE)).toBe(false);
    expect(hasPermission(staff, PERMISSIONS.USERS_MANAGE)).toBe(false);
    expect(hasPermission(superadmin, PERMISSIONS.USERS_MANAGE)).toBe(false);
  });

  it("enforces operations write for staff only", () => {
    expect(hasPermission(staff, PERMISSIONS.SHIPMENTS_WRITE)).toBe(true);
    expect(hasPermission(manager, PERMISSIONS.SHIPMENTS_WRITE)).toBe(false);
    expect(hasPermission(hr, PERMISSIONS.SHIPMENTS_WRITE)).toBe(false);
  });

  it("allows superadmin-only workflows", () => {
    expect(hasPermission(superadmin, PERMISSIONS.ORGANIZATION_REQUESTS_DECIDE)).toBe(true);
    expect(hasPermission(hr, PERMISSIONS.ORGANIZATION_REQUESTS_DECIDE)).toBe(false);
    expect(hasPermission(manager, PERMISSIONS.ORGANIZATION_REQUESTS_DECIDE)).toBe(false);
  });
});
