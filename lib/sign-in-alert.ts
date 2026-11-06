import { headers } from "next/headers";

export type SignInMeta = { ip: string; userAgent: string; time: string };

export async function getSignInMeta(): Promise<SignInMeta> {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    userAgent: h.get("user-agent") ?? "unknown",
    time: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function describeDevice(ua: string): string {
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Unknown browser";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "an unknown device";
  return `${browser} on ${os}`;
}

function describeIp(ip: string): string {
  if (ip === "::1" || ip === "127.0.0.1" || ip === "unknown") {
    return "Local development";
  }
  return ip.replace(/^::ffff:/, "");
}

function buildHtml(opts: {
  name: string;
  how: string;
  time: string;
  device: string;
  ip: string;
  appUrl?: string;
}) {
  const { name, how, time, device, ip, appUrl } = opts;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ece9fe;font-size:13px;color:#6b6a8a;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #ece9fe;font-size:14px;color:#1e1b4b;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;

  const button = appUrl
    ? `
    <tr>
      <td align="center" style="padding:8px 0 4px;">
        <a href="${escapeHtml(appUrl)}/dashboard"
           style="display:inline-block;background:#6d28d9;background-image:linear-gradient(90deg,#4f46e5,#7c3aed,#c026d3);color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 28px;border-radius:12px;">
          Open BizFlow
        </a>
      </td>
    </tr>`
    : "";

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f3ff;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    New sign-in to your BizFlow account on ${escapeHtml(time)}.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ff;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4defa;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td style="height:6px;background:#c026d3;background-image:linear-gradient(90deg,#fb923c,#c026d3,#4f46e5);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 4px;">
              <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#4f46e5;">Biz<span style="color:#c026d3;">Flow</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 0;">
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#1e1b4b;">New sign-in to your account</h1>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#4a4870;">
                Hi ${escapeHtml(name)}, your BizFlow account was just signed in to using <b>${escapeHtml(how)}</b>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background:#faf9ff;border:1px solid #ece9fe;border-radius:14px;padding:4px 18px;">
                <tr><td>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${row("When", `${time} (Lagos)`)}
                    ${row("Device", device)}
                    ${row("IP address", ip)}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 4px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4a4870;">
                If this was you, there's nothing more to do.
              </p>
              <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#b91c1c;font-weight:600;">
                If it wasn't you, change your password right away.
              </p>
            </td>
          </tr>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px;">
            ${button}
          </table>
          <tr>
            <td style="padding:24px 32px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#8b89a8;border-top:1px solid #ece9fe;padding-top:16px;">
                You're receiving this because a sign-in alert is on for your BizFlow account.
                This message was sent automatically, so please don't reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendSignInAlert(
  user: { email: string; name?: string | null },
  method: "password" | "google",
  meta: SignInMeta,
) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM_ADDRESS;
    if (!apiKey || !fromEmail) return;

    const name = user.name ?? "there";
    const how = method === "google" ? "Google" : "email and password";
    const device = describeDevice(meta.userAgent);
    const ip = describeIp(meta.ip);

    const text = [
      `Hi ${name},`,
      "",
      `Your BizFlow account was just signed in to using ${how}.`,
      "",
      `When: ${meta.time} (Lagos)`,
      `Device: ${device}`,
      `IP address: ${ip}`,
      "",
      "If this was you, there's nothing more to do.",
      "If it wasn't you, change your password right away.",
    ].join("\n");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME ?? "BizFlow",
          email: fromEmail,
        },
        to: [{ email: user.email, name: user.name ?? undefined }],
        subject: "New sign-in to your BizFlow account",
        htmlContent: buildHtml({
          name,
          how,
          time: meta.time,
          device,
          ip,
          appUrl: process.env.APP_URL,
        }),
        textContent: text,
      }),
    });
    if (!res.ok) {
      console.error("sign-in alert failed", res.status, await res.text());
    }
  } catch (error) {
    console.error("sign-in alert failed", error);
  }
}