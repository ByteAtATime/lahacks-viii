<script lang="ts">
	import { Chart, registerables } from 'chart.js';

	let canvas: HTMLCanvasElement;
	let prevChart: Chart;

	$: {
		Chart.register(...registerables);

		if (prevChart) {
			prevChart.destroy();
		}

		prevChart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['Swim', 'Sprint', 'Kick', 'Drill/Technique'],
				datasets: [
					{
						data: [12, 5, 7, 3]
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	}
</script>

<canvas bind:this={canvas} />
