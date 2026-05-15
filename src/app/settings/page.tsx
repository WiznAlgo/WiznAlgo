"use client";

import { useState } from "react";
import { Settings, Send, CheckCircle, AlertCircle, Wifi, WifiOff, Bell } from "lucide-react";

function getStored(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export default function SettingsPage() {
  const [botToken, setBotToken] = useState(() => getStored("tg_bot_token"));
  const [chatId, setChatId] = useState(() => getStored("tg_chat_id"));
  const [notifEnabled, setNotifEnabled] = useState(() => getStored("tg_notif_enabled") === "true");
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMsg, setTestMsg] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem("tg_bot_token", botToken);
    localStorage.setItem("tg_chat_id", chatId);
    localStorage.setItem("tg_notif_enabled", String(notifEnabled));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleTest() {
    if (!botToken || !chatId) {
      setTestStatus("error");
      setTestMsg("Bot Token dan Chat ID harus diisi");
      return;
    }
    setTestStatus("loading");
    setTestMsg("");
    try {
      const res = await fetch("/api/telegram-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken, chatId }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestStatus("success");
        setTestMsg("Test message sent! Check your Telegram.");
      } else {
        setTestStatus("error");
        setTestMsg(data.error ?? "Failed to send");
      }
    } catch {
      setTestStatus("error");
      setTestMsg("Network error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-neon-blue" />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      {/* Data Source */}
      <div className="bg-dark-800 border border-neon-blue/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-semibold text-white">Real-Time Data</h2>
        </div>
        <div className="bg-dark-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-gray-300">Binance WebSocket — BTCUSDT, ETHUSDT</span>
          </div>
          <p className="text-xs text-gray-500">
            Real-time candlestick and price data from Binance public API. No API key required.
            Crypto pairs (BTCUSD, ETHUSD) use live data. Other pairs use simulated data.
          </p>
        </div>
        <div className="bg-dark-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">XAUUSD, US30, NAS100, SPX500, EURUSD, GBPUSD, USDJPY</span>
          </div>
          <p className="text-xs text-gray-500">
            Simulated data — upgrade to real broker API for live forex/indices data.
          </p>
        </div>
      </div>

      {/* Telegram */}
      <div className="bg-dark-800 border border-neon-blue/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-semibold text-white">Telegram Notifications</h2>
        </div>

        <p className="text-xs text-gray-500">
          Receive AI trading signals directly on Telegram. Setup:
        </p>
        <ol className="text-xs text-gray-500 list-decimal list-inside space-y-1">
          <li>Open Telegram, search <code className="text-neon-blue">@BotFather</code></li>
          <li>Send <code className="text-neon-blue">/newbot</code> and follow the instructions</li>
          <li>Copy the <b className="text-gray-300">Bot Token</b> and paste below</li>
          <li>
            Get your Chat ID: message your bot, then open{" "}
            <code className="text-neon-blue break-all">
              https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates
            </code>{" "}
            and look for <code className="text-gray-300">&quot;chat&quot;:{`{`}&quot;id&quot;:XXXXXXX{`}`}</code>
          </li>
        </ol>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Bot Token</label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456:ABC-DEF..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-neon-blue/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="123456789"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-neon-blue/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotifEnabled(!notifEnabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${notifEnabled ? "bg-neon-blue" : "bg-dark-600"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifEnabled ? "left-5" : "left-0.5"}`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">
                Auto-send signals to Telegram
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded-lg text-sm font-medium transition-colors"
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
          <button
            onClick={handleTest}
            disabled={testStatus === "loading"}
            className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {testStatus === "loading" ? "Sending..." : "Send Test Message"}
          </button>
        </div>

        {testStatus === "success" && (
          <div className="flex items-center gap-2 text-neon-green text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{testMsg}</span>
          </div>
        )}
        {testStatus === "error" && (
          <div className="flex items-center gap-2 text-neon-red text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{testMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
