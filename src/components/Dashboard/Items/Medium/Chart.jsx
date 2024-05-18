import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = () => {
  // Generate random data for the chart
  const getRandomData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return data;
  };

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };

  const series = [
    {
      name: 'Sales',
      data: getRandomData(), // Get random data for the sales
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
