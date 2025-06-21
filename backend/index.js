const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { getAccessToken } = require('./utils/auth');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ GET all stock tickers
app.get('/stocks', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(process.env.STOCK_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock list' });
  }
});

// ✅ GET average stock price
app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const minutes = req.query.minutes || 30;

  try {
    const token = await getAccessToken();
    const url = `${process.env.STOCK_API}/${ticker}?minutes=${minutes}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const prices = response.data.price;
    const average = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;

    res.json({
      averageStockPrice: average,
      priceHistory: prices
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock price history' });
  }
});

// ✅ GET correlation between two stocks
app.get('/stockcorrelation', async (req, res) => {
  const { minutes, ticker: tickers } = req.query;

  if (!Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: 'Exactly two tickers required' });
  }

  try {
    const token = await getAccessToken();

    const [data1, data2] = await Promise.all(
      tickers.map(t =>
        axios.get(`${process.env.STOCK_API}/${t}?minutes=${minutes}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    );

    const x = data1.data.price.map(p => p.price);
    const y = data2.data.price.map(p => p.price);

    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = (arr, meanVal) => Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - meanVal, 2), 0) / arr.length);
    const cov = (x, y, mx, my) =>
      x.reduce((sum, xi, i) => sum + (xi - mx) * (y[i] - my), 0) / x.length;

    const mx = mean(x), my = mean(y);
    const stdX = std(x, mx), stdY = std(y, my);
    const correlation = cov(x, y, mx, my) / (stdX * stdY);

    res.json({
      correlation,
      stocks: {
        [tickers[0]]: data1.data,
        [tickers[1]]: data2.data
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute correlation' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
