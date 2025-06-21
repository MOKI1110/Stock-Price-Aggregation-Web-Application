import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import StockChart from '../components/StockChart';

export default function StockPage() {
  const [ticker, setTicker] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/stocks') // From your backend
      .then(res => setStocks(Object.values(res.data.stocks)))
      .catch(err => console.error(err));
  }, []);

  const fetchStockData = () => {
    axios.get(`http://localhost:5000/stocks/${ticker}?minutes=${minutes}&aggregation=average`)
      .then(res => setChartData(res.data))
      .catch(err => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Stock Price Analysis</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Stock</InputLabel>
        <Select value={ticker} onChange={e => setTicker(e.target.value)}>
          {stocks.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Time (minutes)</InputLabel>
        <Select value={minutes} onChange={e => setMinutes(e.target.value)}>
          {[10, 30, 50, 100].map(m => <MenuItem key={m} value={m}>{m} minutes</MenuItem>)}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={fetchStockData}>Fetch Data</Button>

      {chartData && <StockChart data={chartData} />}
    </Container>
  );
}
