const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function resetLink(token: string) {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}/reset-password/${token}`;
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  name: string;
  link: string;
}): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM_ADDRESS;
    if (!apiKey || !fromEmail) return false;

    const { to, name, link } = opts;

    const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f3ff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3ff;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;border:1px solid #e4defa;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:28px 32px 4px;">
          <span style="font-size:22px;font-weight:800;color:#4f46e5;">Biz<span style="color:#c026d3;">Flow</span></span>
        </td></tr>
        <tr><td style="padding:12px 32px 0;">
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#1e1b4b;">Reset your password</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#4a4870;">
            Hi ${escapeHtml(name)}, we received a request to reset the password for your BizFlow account.
          </p>
        </td></tr>
        <tr><td align="center" style="padding:24px 32px 8px;">
          <a href="${escapeHtml(link)}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 28px;border-radius:12px;">Choose a new password</a>
        </td></tr>
        <tr><td style="padding:16px 32px 28px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8b89a8;border-top:1px solid #ece9fe;padding-top:16px;">
            This link works for 1 hour and can be used once. If you didn't ask for this,
            ignore this email. Your password stays the same.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const text = [
      `Hi ${name},`,
      "",
      "We received a request to reset the password for your BizFlow account.",
      `Choose a new password: ${link}`,
      "",
      "This link works for 1 hour and can be used once.",
      "If you didn't ask for this, ignore this email. Your password stays the same.",
    ].join("\n");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: process.env.EMAIL_FROM_NAME ?? "BizFlow", email: fromEmail },
        to: [{ email: to, name }],
        subject: "Reset your BizFlow password",
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!res.ok) {
      console.error("reset email failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("reset email failed", error);
    return false;
  }
}