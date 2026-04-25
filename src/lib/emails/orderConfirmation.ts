export function orderConfirmationTemplate({
  name,
  orderNumber,
  items,
  total,
}: {
  name?: string
  orderNumber: string
  items: { name: string; quantity: number; price: number }[]
  total: number
}) {
  return {
    subject: `Order confirmed — #${orderNumber}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 24px; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.01em;">Order confirmed</h2>

        <p style="margin-bottom: 32px; font-size: 14px; color: #444;">
          Thanks ${name ?? "there"}. Your order has been received and is being processed.
        </p>

        <div style="padding: 24px; background: #f9f9f9; border-radius: 8px; margin-bottom: 32px;">
          <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em;">Order Details</p>
          <p style="margin: 0 0 24px 0; font-size: 14px; font-weight: 600;">#${orderNumber}</p>

          <div style="space-y: 12px;">
            ${items
              .map(
                (i) =>
                  `<div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                    <span style="color: #444;">${i.name} <span style="color: #999;">× ${i.quantity}</span></span>
                    <span style="font-weight: 500;">₦${(i.price * i.quantity).toLocaleString("en-NG")}</span>
                  </div>`
              )
              .join("")}
          </div>

          <div style="margin-top: 24px; pt-16; border-top: 1px solid #eee; padding-top: 16px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 600;">
            <span>Total</span>
            <span>₦${total.toLocaleString("en-NG")}</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #666; margin: 0;">
          We’ll notify you as soon as your order ships.
        </p>
      </div>
    `,
  }
}
