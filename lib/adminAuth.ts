import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function requireAdminSession(): Promise<{ ok: true } | { ok: false; response: Response }> {
  const session = await auth();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true };
}
