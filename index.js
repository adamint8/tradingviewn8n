const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/chart', async (req, res) => {
  const symbol = req.query.symbol || 'NASDAQ:AAPL';
  const interval = req.query.interval || 'D';
  const indicators = req.query.indicators
    ? req.query.indicators.split(',').map(ind => `${ind}@tv-basicstudies`).join('%2C')
    : '';

  const chartUrl = `https://www.tradingview.com/chart/?symbol=${symbol}&interval=${interval}`;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(chartUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(8000); // זמן לטעינה

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to generate chart screenshot', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('TradingView Chart Screenshot Server is running');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://0.0.0.0:${port}`);
});
