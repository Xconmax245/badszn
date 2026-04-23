import { formatNaira } from "./utils/formatCurrency"

export function formatOrderMessage(order: any) {
  const itemsText = order.items
    .map((item: any, i: number) => {
      const productName = item.product?.name || item.name || "Unknown Product"
      const size = item.size || item.variant?.size || "N/A"
      const qty = item.quantity || 1
      const price = Number(item.price || 0)
      
      return `${i + 1}. <b>${productName}</b>\n   Size: ${size}\n   Qty: ${qty}\n   ${formatNaira(price * qty)}`
    })
    .join("\n\n")

  let addressText = "No address provided"
  if (order.shippingAddress) {
    try {
      const address = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress
        
      addressText = `<b>${address.fullName || "Guest"}</b>\n${address.line1 || "No street"}${address.line2 ? `, ${address.line2}` : ""}\n${address.city || ""}, ${address.state || ""}\n${address.phone || ""}`
    } catch (e) {
      console.error("Failed to parse shipping address JSON", e)
    }
  }

  return `
<b>🧾 NEW ORDER</b>

<b>Order ID:</b> <code>${order.orderNumber || order.id}</code>
<b>Customer:</b> ${order.customer?.email || order.guestEmail || "Guest"}

<b>Items:</b>
${itemsText}

<b>Total:</b> <b>${formatNaira(Number(order.total))}</b>

<b>Shipping:</b>
${addressText}

<b>Status:</b> PAID
  `
}
