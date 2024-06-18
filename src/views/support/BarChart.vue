<template>
  <div class="chart-container">
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "BarChart",
  props: {
    results: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const labels = this.results.map((result) => result.choice_result);
      const data = this.results.map((result) => result.choice_count);

      new Chart(this.$refs.barChart, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "학생수",
              data: data,
              backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // y축의 간격을 1로 설정하여 자연수만 표시
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
            },
          },
          layout: {
            padding: {
              bottom: 0,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "right", // 범례를 오른쪽에 표시
              labels: {
                boxWidth: 10, // 범례 상자의 너비를 10으로 설정
                boxHeight: 10, // 범례 상자의 높이를 10으로 설정
                generateLabels: function (chart) {
                  const datasets = chart.data.datasets[0];
                  return chart.data.labels.map((label, i) => ({
                    text: label,
                    fillStyle: datasets.backgroundColor[i],
                    strokeStyle: datasets.borderColor[i],
                    lineWidth: 1,
                    hidden: false,
                    index: i,
                  }));
                },
              },
            },
            title: {
              display: true,
              text: "",
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
