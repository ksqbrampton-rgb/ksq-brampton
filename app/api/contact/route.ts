import { NextResponse } from "next/server";
import { sendContactFormEmails } from "@/lib/email";
import { contactLimiter, checkRateLimit, getClientIp } from "@/lib/ratelimit";

export async function POST(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  const rl = await checkRateLimit(contactLimiter, `contact:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 422 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }

  // Sanitise inputs
  const sanitised = {
    name:    name.trim().slice(0, 100),
    email:   email.trim().toLowerCase().slice(0, 254),
    phone:   body.phone?.trim().slice(0, 30),
    message: message.trim().slice(0, 2000),
  };

  try {
    await sendContactFormEmails(sanitised);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
