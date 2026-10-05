import { createTransport } from "nodemailer";

import { site } from "@/data/site";
import { trimValues, validateContact, type ContactField, type ContactResponse } from "@/lib/contact";

// nodemailer needs Node.js APIs (TCP sockets for SMTP)
export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 3_000; // humans need a few seconds to fill the form
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const TURNSTILE_ACTION = "contact-form";

const UNAVAILABLE_MESSAGE = `The contact form is temporarily unavailable. Please email ${site.email} directly.`;

// Sliding window per IP. Lives in memory, so each warm serverless instance keeps its own count.
const rateLimits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimits.set(ip, { count: 1, windowStart: now });
  } else {
    record.count += 1;
  }

  if (rateLimits.size > 1000) {
    for (const [key, value] of rateLimits) {
      if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) rateLimits.delete(key);
    }
  }

  return (rateLimits.get(ip)?.count ?? 0) > MAX_REQUESTS_PER_WINDOW;
}

function reply(body: ContactResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function fail(error: string, status: number, field?: ContactField | "turnstile") {
  return reply({ success: false, error, ...(field ? { field } : {}) }, status);
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "";
}

// Tokens are only accepted from the production domain, Vercel previews, local development,
// and any extra domains listed (comma-separated) in ALLOWED_HOSTNAMES.
function isAllowedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  const extra = (process.env.ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const productionHost = new URL(site.url).hostname;

  return (
    [productionHost, "localhost", "127.0.0.1", "::1", ...extra].includes(host) ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".localhost")
  );
}

type TurnstileResult = "ok" | "rejected" | "misconfigured" | "unreachable";

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<TurnstileResult> {
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.append("remoteip", ip);

  let data: { success?: boolean; hostname?: string; action?: string; "error-codes"?: string[] };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    data = await response.json();
  } catch (error) {
    console.error("[contact] Turnstile siteverify request failed:", error);
    return "unreachable";
  }

  const errorCodes = data["error-codes"] ?? [];
  if (errorCodes.includes("invalid-input-secret") || errorCodes.includes("missing-input-secret")) {
    console.error("[contact] TURNSTILE_SECRET_KEY is invalid or does not belong to the site key's widget.");
    return "misconfigured";
  }

  const hostnameOk = !data.hostname || isAllowedHostname(data.hostname);
  if (data.success && !hostnameOk) {
    console.error(
      `[contact] Turnstile token was issued for "${data.hostname}", which is not allowed. Add it to ALLOWED_HOSTNAMES.`,
    );
  }
  const actionOk = !data.action || data.action === TURNSTILE_ACTION;

  if (!data.success || !hostnameOk || !actionOk) {
    console.warn("[contact] Turnstile verification failed:", {
      success: data.success,
      hostname: data.hostname,
      action: data.action,
      errorCodes,
    });
    return "rejected";
  }

  return "ok";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmail(values: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = values;
  const text = `New message from ${site.name}'s portfolio

Name:
${name}

Email:
${email}

Subject:
${subject}

Message:
${message}

---
Reply directly to this email to respond to ${name} (${email}).`;

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, "<br>"),
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 20px; background-color: #f5f5f7; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e2e8; overflow: hidden; }
    .header { background: #0a0a0c; color: #ffffff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; color: #9e9ea7; font-size: 13px; }
    .content { padding: 28px; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 11px; font-weight: 700; color: #62626e; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px; }
    .field-value { font-size: 15px; color: #111114; font-weight: 500; }
    .message-box { background: #f7f7f9; border-left: 4px solid #0a0a0c; padding: 18px; border-radius: 4px; font-size: 15px; color: #222225; margin-top: 8px; word-break: break-word; }
    .footer { background: #fafafc; padding: 18px 28px; font-size: 13px; color: #6e6e78; border-top: 1px solid #eeeeef; }
    .footer a { color: #0a0a0c; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>New Message from ${escapeHtml(site.name)}'s Portfolio</h1>
      <p>Sent via ${escapeHtml(new URL(site.url).host)}</p>
    </div>
    <div class="content">
      <div class="field-group"><div class="field-label">Sender Name</div><div class="field-value">${safe.name}</div></div>
      <div class="field-group"><div class="field-label">Sender Email</div><div class="field-value"><a href="mailto:${safe.email}">${safe.email}</a></div></div>
      <div class="field-group"><div class="field-label">Subject</div><div class="field-value">${safe.subject}</div></div>
      <div class="field-group"><div class="field-label">Message</div><div class="message-box">${safe.message}</div></div>
    </div>
    <div class="footer">Click <strong>Reply</strong> to respond to <strong>${safe.name}</strong> (<a href="mailto:${safe.email}">${safe.email}</a>).</div>
  </div>
</body>
</html>`;

  return { text, html };
}

export async function POST(request: Request) {
  // 1. Parse a small JSON body
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return fail("Your message is too long.", 413);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail("Your message is too long.", 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  // 2. Honeypot: a hidden field that only bots fill in
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";
  if (honeypot) return fail("Spam submission detected.", 400);

  // 3. Timing: reject forms submitted too fast to be human, or from a stale page
  const startedAt = Number(body.formStartTime);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_TIME_MS) {
    return fail("Spam submission detected.", 400);
  }
  if (elapsed > MAX_FORM_AGE_MS) {
    return fail("This page has been open for a long time. Please refresh it and send your message again.", 400);
  }

  // 4. Rate limit per IP
  const ip = clientIp(request);
  if (ip && isRateLimited(ip)) {
    return fail("Too many messages. Please wait a few minutes before trying again.", 429);
  }

  // 5. Field validation (same rules as the browser)
  const values = trimValues(body);
  const errors = validateContact(values);
  const firstInvalid = (Object.keys(errors) as ContactField[])[0];
  if (firstInvalid) return fail(errors[firstInvalid] as string, 400, firstInvalid);

  // 6. Cloudflare Turnstile human verification
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";
  if (!token) return fail("Please verify that you are human and try again.", 400, "turnstile");

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!turnstileSecret) {
    console.error("[contact] TURNSTILE_SECRET_KEY is not set.");
    return fail(UNAVAILABLE_MESSAGE, 503);
  }

  const verification = await verifyTurnstile(token, turnstileSecret, ip);
  if (verification === "misconfigured") return fail(UNAVAILABLE_MESSAGE, 503);
  if (verification === "unreachable") {
    return fail("Human verification could not be completed. Please try again in a moment.", 502, "turnstile");
  }
  if (verification === "rejected") {
    return fail("Human verification failed or expired. Please verify again and resend.", 400, "turnstile");
  }

  // 7. Send the email over SMTP
  const smtpPassword = process.env.SMTP_PASSWORD?.trim();
  if (!smtpPassword) {
    console.error("[contact] SMTP_PASSWORD is not set.");
    return fail(UNAVAILABLE_MESSAGE, 503);
  }

  const smtpUser = process.env.SMTP_USER?.trim() || site.email;
  const transporter = createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT ?? "465", 10),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user: smtpUser, pass: smtpPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const { text, html } = buildEmail(values);

  try {
    await transporter.sendMail({
      from: `"${site.name} Portfolio" <${smtpUser}>`,
      to: process.env.CONTACT_EMAIL?.trim() || site.email,
      replyTo: values.email,
      // Keep the subject on one line
      subject: `Portfolio Contact: ${values.subject.replace(/[\r\n]+/g, " ")}`,
      text,
      html,
    });
  } catch (error) {
    // Details stay in the server logs; visitors get a friendly message
    console.error("[contact] Sending the email failed:", error);
    return fail(`Your message could not be sent right now. Please try again later or email ${site.email} directly.`, 502);
  }

  return reply({ success: true, message: "Message sent successfully. Thanks for reaching out!" }, 200);
}
