import React, { useEffect, useState } from "react";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Paper,
} from "@mui/material";

export default function CorrelationPage() {
  const [stockList, setStockList] = useState([]);
  const [stock1, setStock1] = useState("");
  const [stock2, setStock2] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [correlation, setCorrelation] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stocks")
      .then((res) => setStockList(Object.values(res.data.stocks)))
      .catch((err) => console.error(err));
  }, []);

  const handleFetchCorrelation = () => {
    axios
      .get(
        `http://localhost:5000/stockcorrelation?minutes=${minutes}&ticker=${stock1}&ticker=${stock2}`
      )
      .then((res) => setCorrelation(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Analysis
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Stock 1</InputLabel>
          <Select value={stock1} onChange={(e) => setStock1(e.target.value)}>
            {stockList.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Stock 2</InputLabel>
          <Select value={stock2} onChange={(e) => setStock2(e.target.value)}>
            {stockList.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Minutes</InputLabel>
          <Select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
            {[10, 30, 50].map((m) => (
              <MenuItem key={m} value={m}>
                {m} mins
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        sx={{ mt: 3 }}
        variant="contained"
        onClick={handleFetchCorrelation}
        disabled={!stock1 || !stock2 || stock1 === stock2}
      >
        Get Correlation
      </Button>

      {correlation && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">
            Correlation Coefficient: {correlation.correlation.toFixed(4)}
          </Typography>
          <Typography variant="body2">
            {correlation.correlation >= 0.7
              ? "Strong Positive Correlation"
              : correlation.correlation <= -0.7
              ? "Strong Negative Correlation"
              : "Weak/No Correlation"}
          </Typography>

          <CorrelationHeatmap
            stock1={stock1}
            stock2={stock2}
            correlation={correlation.correlation}
          />
        </Paper>
      )}
    </Container>
  );
}
