import React from 'react';
import HeatMap from 'react-heatmap-grid';
import { Box, Typography } from '@mui/material';

export default function CorrelationHeatmap({ stock1, stock2, correlation }) {
  // Define heatmap structure
  const xLabels = [stock2];
  const yLabels = [stock1];
  const data = [[correlation]];

  // Generate color based on correlation value
  const getColor = (value) => {
    const ratio = (value + 1) / 2; // map -1 to 0 and +1 to 1
    const red = Math.round(255 * ratio);
    const blue = Math.round(255 * (1 - ratio));
    return `rgb(${red}, 0, ${blue})`;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Correlation Heatmap</Typography>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={data}
        squares
        cellStyle={(background, value) => ({
          background: getColor(value),
          color: '#fff',
          fontSize: '1.2rem'
        })}
        cellRender={(value) => value.toFixed(2)}
      />
    </Box>
  );
}
