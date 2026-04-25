export function verifyEmailTemplate({
  name,
  verifyUrl,
}: {
  name?: string
  verifyUrl: string
}) {
  return {
    subject: "Confirm your email",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 24px; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.01em;">Confirm your email</h2>

        <p style="margin-bottom: 32px; font-size: 14px; color: #444;">
          ${name ? `Hi ${name},` : "Hi,"}
          <br/><br/>
          Please confirm your email to continue with your BAD SZN account.
        </p>

        <a href="${verifyUrl}" 
           style="display:inline-block; padding:14px 28px; background: #111; color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 4px;">
           Confirm Email
        </a>

        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999; margin: 0;">
            If you didn’t create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  }
}
