<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { eventToShortName, type AgeRange, type Event, type Stroke } from '$lib/swimming';
	import standards from '../../standards.json';
	import { t } from 'svelte-i18n';

	let chart: HTMLCanvasElement;
	let prevChart: Chart;

	export let im: number | null;
	export let free: number | null;
	export let back: number | null;
	export let breast: number | null;
	export let fly: number | null;

	export let age: AgeRange;
	export let gender: 'boy' | 'girl';
	export let distance: number;

	export const timeToScore = (time: number | null, stroke: Stroke) => {
		if (!time) return null;
		try {
			const event: Event = {
				gender,
				age,
				poolSize: 'SCY',
				length: distance,
				stroke
			};
			const standard = standards[gender].SCY[event.age][eventToShortName(event)].b;

			const x = 0.5 ** (time / standard);

			return 100 * (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
		} catch {
			return null;
		}
	};

	$: {
		distance;
		if (prevChart) prevChart.destroy();
		Chart.register(...registerables);

		prevChart = new Chart(chart, {
			type: 'radar',
			data: {
				labels: [
					$t('strokes.im'),
					$t('strokes.free'),
					$t('strokes.back'),
					$t('strokes.breast'),
					$t('strokes.fly')
				],
				datasets: [
					{
						data: [
							timeToScore(im, 'im'),
							timeToScore(free, 'free'),
							timeToScore(back, 'back'),
							timeToScore(breast, 'breast'),
							timeToScore(fly, 'fly')
						]
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
					r: {
						suggestedMin: 0,
						suggestedMax: 100,
						grid: {
							color: 'rgb(255, 255, 255, 0.2)'
						},
						ticks: {
							color: 'var(--bc)',
							showLabelBackdrop: false
						}
					}
				}
			}
		});
	}
</script>

<div class="w-full">
	<canvas bind:this={chart} />
</div>
