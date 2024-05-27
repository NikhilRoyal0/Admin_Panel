import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Text } from '@chakra-ui/react';

export default function Large3() {
  const pieChartData = {
    series: [200, 150, 97, 59],
    options: {
      chart: {
        type: 'pie',
      },
      labels: ['70% above', '80% above', '90% above', '95% above'],
      plotOptions: {
        pie: {
          offsetY: 60,
        }
      }
    },
  };

  return (
    <Box p={4} borderRadius="lg" width="100%" overflow="auto">
      <Text fontSize="xl" fontWeight="bold" mb="4">Student Marks Records</Text>
      <Box width="100%">
        <Chart
          options={pieChartData.options}
          series={pieChartData.series}
          type="pie"
          height="300"
          width="100%"
        />
      </Box>
    </Box>
  );
}
