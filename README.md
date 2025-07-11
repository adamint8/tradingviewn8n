# 📈 TradingView Chart Screenshot API

This project provides a lightweight Node.js API for generating chart screenshots from [TradingView](https://tradingview.com) using headless Chrome (Puppeteer).  
It is designed for integration with tools like [n8n](https://n8n.io), GPT assistants, or any system that needs real-time technical chart analysis.

---

## 🚀 How it Works

The service loads a TradingView embed chart (with optional indicators), waits for rendering, takes a screenshot, and returns it as a PNG.

---

## 🔗 Example Usage

GET /chart?symbol=NASDAQ:AAPL&interval=15&indicators=MACD,RSI


- `symbol`: TradingView asset symbol (e.g., `NASDAQ:AAPL`, `BINANCE:BTCUSDT`)
- `interval`: Chart timeframe (`1`, `5`, `15`, `60`, `D`, `W`, `M`)
- `indicators`: Comma-separated list of basic studies (e.g., `MACD,RSI`)

---

## 🧪 Example Response

Returns a PNG screenshot of the chart with specified parameters.

---

## 📦 Tech Stack

- Node.js
- Express
- Puppeteer (headless Chromium)
- Hosted on [Render.com](https://render.com)

---

## 🛠️ Deployment Notes

Ensure the server supports headless Chrome:
- Use `--no-sandbox --disable-setuid-sandbox`
- Allow 6–8 seconds for TradingView to load the embed chart

---

## 📝 License

MIT — free to use, modify, and distribute.
