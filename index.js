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

  const chartUrl = `https://www.tradingview.com/embed-widget/advanced-chart/?symbol=${symbol}&interval=${interval}&style=1&theme=dark${indicators ? `&studies=${indicators}` : ''}`;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  try {
    await page.goto(chartUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(8000); // ממתין לטעינה מלאה של הגרף

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();
    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (err) {
    await browser.close();
    res.status(500).json({ error: 'Failed to generate chart screenshot', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('TradingView Chart Screenshot Server is running');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
