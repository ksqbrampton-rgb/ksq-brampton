import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ksq-brampton",
    timestamp: new Date().toISOString(),
  });
}
