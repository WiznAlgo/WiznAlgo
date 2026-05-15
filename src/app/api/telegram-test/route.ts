export async function POST(request: Request) {
  try {
    const { botToken, chatId } = await request.json();

    if (!botToken || !chatId) {
      return Response.json(
        { error: "Missing botToken or chatId" },
        { status: 400 }
      );
    }

    const message =
      "🤖 <b>WiznAlgo Connected!</b>\n\n" +
      "✅ Telegram notifications are working.\n" +
      "You will receive trading signals here.\n\n" +
      "📊 <i>Market Analysis WiznAlgo</i>";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      return Response.json(
        { error: data.description ?? "Telegram API error" },
        { status: 400 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
