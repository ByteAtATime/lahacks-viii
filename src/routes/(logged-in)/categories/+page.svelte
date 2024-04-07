<script>
	import CategoriesChart from '$lib/components/CategoriesChart.svelte';
	import SkillsChart from '$lib/components/SkillsChart.svelte';
	import StrokesChart from '$lib/components/StrokesChart.svelte';
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="text-4xl font-bold">Statistics</h1>
	<h2 class="mb-2 mt-8 text-2xl font-bold">Categories</h2>
	<CategoriesChart />
	<h2 class="mb-2 mt-8 text-2xl font-bold">Strokes</h2>
	<StrokesChart />
</div>
