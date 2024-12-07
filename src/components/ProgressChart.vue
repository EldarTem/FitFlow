<template>
  <div>
    <!-- Используйте библиотеку для графиков, например, Chart.js -->
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ProgressEntry } from "@/types";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

export default defineComponent({
  name: "ProgressChart",
  props: {
    data: {
      type: Array as () => ProgressEntry[],
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      if (chartCanvas.value) {
        new Chart(chartCanvas.value, {
          type: "line",
          data: {
            labels: props.data.map((entry) => entry.date),
            datasets: [
              {
                label: "Прогресс",
                data: props.data.map((entry) => entry.value),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          },
        });
      }
    });

    return {
      chartCanvas,
    };
  },
});
</script>
