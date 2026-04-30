import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireApiPermission } = vi.hoisted(() => ({
  requireApiPermission: vi.fn(),
}));
vi.mock("@/lib/rbac", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rbac")>("@/lib/rbac");
  return {
    ...actual,
    requireApiPermission,
  };
});

import shipmentsHandler from "@/pages/api/shipments";

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn();
  return res;
}

describe("Cross-organization isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("always scopes shipment GET by caller organization_id", async () => {
    const eq = vi.fn().mockReturnThis();
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const select = vi.fn().mockReturnValue({ eq, order });
    const from = vi.fn().mockReturnValue({ select });

    requireApiPermission.mockResolvedValueOnce({
      ctx: {
        supabase: { from },
        authUserId: "u1",
        user: {
          user_id: "u1",
          organization_id: "org_alpha",
          role: "staff",
          is_super_admin: false,
          email: "u1@example.com",
        },
      },
    });

    const req: any = { method: "GET", headers: {} };
    const res = mockRes();
    await shipmentsHandler(req, res);

    expect(eq).toHaveBeenCalledWith("organization_id", "org_alpha");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
