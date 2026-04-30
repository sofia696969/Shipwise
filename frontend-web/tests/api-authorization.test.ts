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

import usersHandler from "@/pages/api/users";
import shipmentsHandler from "@/pages/api/shipments";

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn();
  return res;
}

describe("API authorization guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects users API when guard denies", async () => {
    requireApiPermission.mockResolvedValueOnce(null);
    const req: any = { method: "GET", headers: {} };
    const res = mockRes();
    await usersHandler(req, res);
    expect(requireApiPermission).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  it("rejects shipments API when guard denies", async () => {
    requireApiPermission.mockResolvedValueOnce(null);
    const req: any = { method: "GET", headers: {} };
    const res = mockRes();
    await shipmentsHandler(req, res);
    expect(requireApiPermission).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});
