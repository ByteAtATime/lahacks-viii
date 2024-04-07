<script lang="ts">
	import { formatTime } from '$lib/swimming';
	import { Chart } from 'chart.js';
	import 'chartjs-adapter-luxon';

	let canvas: HTMLCanvasElement;
	let prevChart: Chart;

	export let free: { x: Date; y: number }[];
	export let back: { x: Date; y: number }[];
	export let breast: { x: Date; y: number }[];
	export let fly: { x: Date; y: number }[];
	export let im: { x: Date; y: number }[];

	$: {
		if (prevChart) prevChart.destroy();

		prevChart = new Chart(canvas, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Free',
						data: free,
						borderColor: 'rgb(75, 192, 192)'
					},
					{
						label: 'Back',
						data: back,
						borderColor: 'rgb(255, 99, 132)'
					},
					{
						label: 'Breast',
						data: breast,
						borderColor: 'rgb(54, 162, 235)'
					},
					{
						label: 'Fly',
						data: fly,
						borderColor: 'rgb(255, 205, 86)'
					},
					{
						label: 'IM',
						data: im,
						borderColor: 'rgb(153, 102, 255)'
					}
				]
			},
			options: {
				scales: {
					x: {
						type: 'time'
					},
					y: {
						ticks: {
							callback: (value) => formatTime(value)
						}
					}
				}
			}
		});
	}
</script>

<div class="max-w-full">
	<canvas bind:this={canvas} />
</div>
