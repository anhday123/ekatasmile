import React from "react";
// import { Bar } from "@reactchartjs/react-chart.js";
import { Bar } from 'react-chartjs-2';
export default function ChartPage() {
  const datas = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    datasets: [
      {
        label: "Doanh thu",
        data: [12, 19, 3, 5, 2, 3, 5, 12, 4, 6, 7],
        backgroundColor: "#007BFF",
      },
      {
        label: "Lợi nhuận",
        data: [2, 3, 20, 5, 1, 4, 7, 11, 5, 2, 5],
        backgroundColor: "#D3E8FF",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return <Bar data={datas} options={options} />;
}
