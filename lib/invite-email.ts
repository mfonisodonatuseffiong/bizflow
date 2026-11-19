const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function inviteLink(token: string) {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}/invite/${token}`;
}

export async function sendInviteEmail(opts: {
  to: string;
  businessName: string;
  inviterName: string;
  role: string;
  link: string;
}): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM_ADDRESS;
    if (!apiKey || !fromEmail) return false;

    const { to, businessName, inviterName, role, link } = opts;
    const roleLabel = role.toLowerCase();

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
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#1e1b4b;">You're invited to join ${escapeHtml(businessName)}</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#4a4870;">
            ${escapeHtml(inviterName)} invited you to join <b>${escapeHtml(businessName)}</b> on BizFlow as a <b>${escapeHtml(roleLabel)}</b>.
          </p>
        </td></tr>
        <tr><td align="center" style="padding:24px 32px 8px;">
          <a href="${escapeHtml(link)}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 28px;border-radius:12px;">Accept invitation</a>
        </td></tr>
        <tr><td style="padding:16px 32px 28px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#8b89a8;border-top:1px solid #ece9fe;padding-top:16px;">
            This link expires in 7 days and only works for ${escapeHtml(to)}.
            If you weren't expecting this, you can ignore the email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const text = [
      `${inviterName} invited you to join ${businessName} on BizFlow as a ${roleLabel}.`,
      "",
      `Accept the invitation: ${link}`,
      "",
      `This link expires in 7 days and only works for ${to}.`,
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
        to: [{ email: to }],
        subject: `Join ${businessName} on BizFlow`,
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!res.ok) {
      console.error("invite email failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("invite email failed", error);
    return false;
  }
}