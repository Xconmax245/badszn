export function paymentReceivedTemplate({ 
  orderNumber 
}: { 
  orderNumber: string 
}) {
  return {
    subject: `Payment confirmed — #${orderNumber}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 24px; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.01em;">Payment confirmed</h2>
        
        <p style="margin-bottom: 32px; font-size: 14px; color: #444;">
          Your payment for order <strong>#${orderNumber}</strong> has been successfully processed. 
          We are now preparing your items for shipment.
        </p>

        <p style="font-size: 13px; color: #666; margin: 0;">
          Thank you for shopping with BAD SZN.
        </p>
      </div>
    `,
  }
}
