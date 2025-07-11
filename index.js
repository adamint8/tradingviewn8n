const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const chromePath = '/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome';

app.get('/chart', async (req, res) => {
  const symbol = req.query.symbol || 'NASDAQ:AAPL';
  const interval = req.query.interval || 'D';

  if (!fs.existsSync(chromePath)) {
    console.error('❌ Chrome binary not found at:', chromePath);
    return res.status(500).json({ error: 'Chrome binary not found.' });
  }

  const chartUrl = `https://www.tradingview.com/chart/?symbol=${symbol}&interval=${interval}`;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(chartUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(8000);

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (err) {
    console.error('Error generating chart:', err.message);
    res.status(500).json({ error: 'Failed to generate chart screenshot', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('TradingView Chart Screenshot Server is running');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is listening at http://0.0.0.0:${port}`);
});
