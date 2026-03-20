import nodemailer from 'nodemailer'

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/**
 * Send a new-lead notification to the site owner.
 */
export async function sendLeadNotification({ name, email, message, id }) {
  if (!process.env.SMTP_HOST || !process.env.NOTIFICATION_EMAIL) {
    console.warn('[email] SMTP not configured — skipping notification')
    return
  }

  const transporter = createTransport()

  await transporter.sendMail({
    from: `"Apex Leads" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `🎯 New lead: ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;padding:32px;border-radius:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
          <div style="background:#C8FF00;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="color:#0A0A0F;font-weight:bold;font-size:14px;">A</span>
          </div>
          <span style="font-weight:700;font-size:18px;letter-spacing:-0.5px;">APEX</span>
        </div>

        <h2 style="color:#C8FF00;margin:0 0 8px;">New Lead Received</h2>
        <p style="color:#888;font-size:13px;margin:0 0 24px;">Lead ID: <code style="color:#C8FF00;">${id}</code></p>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px;background:#1C1C2A;border-radius:8px 8px 0 0;border-bottom:1px solid #26263A;">
              <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Name</span>
              <div style="color:#E8E8F0;font-size:16px;font-weight:600;margin-top:4px;">${name}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px;background:#1C1C2A;border-bottom:1px solid #26263A;">
              <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Email</span>
              <div style="margin-top:4px;">
                <a href="mailto:${email}" style="color:#C8FF00;font-size:16px;">${email}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px;background:#1C1C2A;border-radius:0 0 8px 8px;">
              <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Message</span>
              <div style="color:#E8E8F0;font-size:15px;line-height:1.6;margin-top:4px;">${message}</div>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;text-align:center;">
          <a href="mailto:${email}?subject=Re: Your inquiry to Apex"
             style="background:#C8FF00;color:#0A0A0F;padding:12px 28px;border-radius:999px;font-weight:700;text-decoration:none;font-size:13px;text-transform:uppercase;letter-spacing:2px;">
            Reply to ${name.split(' ')[0]}
          </a>
        </div>

        <p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">
          Apex Lead Generation System · Auto-generated notification
        </p>
      </div>
    `,
  })
}

/**
 * Send a confirmation email to the lead.
 */
export async function sendLeadConfirmation({ name, email }) {
  if (!process.env.SMTP_HOST) return

  const transporter = createTransport()
  const firstName = name.split(' ')[0]

  await transporter.sendMail({
    from: `"Apex" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Got it, ${firstName} — we'll be in touch`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0A0A0F;color:#E8E8F0;padding:40px 32px;border-radius:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
          <div style="background:#C8FF00;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="color:#0A0A0F;font-weight:bold;font-size:14px;">A</span>
          </div>
          <span style="font-weight:700;font-size:18px;letter-spacing:-0.5px;">APEX</span>
        </div>

        <h1 style="font-size:28px;font-weight:800;margin:0 0 12px;">Hey ${firstName}, we got your message.</h1>
        <p style="color:#888;font-size:16px;line-height:1.7;margin:0 0 24px;">
          Thanks for reaching out. Someone from our team will review your project details and respond within <strong style="color:#C8FF00;">one business day</strong>.
        </p>
        <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 32px;">
          In the meantime, feel free to browse our case studies or connect with us on LinkedIn.
        </p>

        <div style="background:#1C1C2A;border-radius:10px;padding:20px;border-left:3px solid #C8FF00;">
          <p style="color:#C8FF00;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px;">What to expect</p>
          <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0;">
            A brief discovery call (30 min) → Tailored growth plan → Proposal with clear scope and pricing → Kickoff within 2 weeks.
          </p>
        </div>

        <p style="color:#444;font-size:12px;text-align:center;margin-top:32px;">
          © ${new Date().getFullYear()} Apex Growth · You're receiving this because you submitted our contact form.
        </p>
      </div>
    `,
  })
}
