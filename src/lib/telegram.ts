const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!

export async function sendTelegramMessage(text: string) {
  if (!TOKEN || !CHAT_ID) {
    console.warn("Telegram credentials missing. Skipping message.")
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Telegram API error:", error)
    }
  } catch (err) {
    console.error("Failed to send Telegram message:", err)
  }
}
