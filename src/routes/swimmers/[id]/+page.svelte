<script lang="ts">
	import { page } from '$app/stores';
	import HistoryChart from '$lib/components/HistoryChart.svelte';
	import SkillsChart from '$lib/components/SkillsChart.svelte';
	import { firestore } from '$lib/firebase';
	import {
		TimeStandard,
		eventToKey,
		formatStroke,
		formatTime,
		timeToStandard,
		type Stroke
	} from '$lib/swimming';
	import { collectionStore, docStore } from 'sveltefire';
	import { t } from 'svelte-i18n';

	const swimmer = docStore(firestore, `users/${$page.params.id}`);

	$: pbs = $swimmer?.pbs ?? {};
	$: history = collectionStore(firestore, `users/${$page.params.id}/history`);

	const pb = (stroke: Stroke, distance: number) =>
		pbs[eventToKey({ stroke, length: distance, poolSize: 'SCY', age: '13-14', gender: 'boy' })] ??
		null;

	let customDistance: null | number = null;

	let distance = 50;

	$: if (customDistance !== null) {
		distance = customDistance;
	}

	const getStandard = (stroke, time) =>
		timeToStandard(
			{
				stroke,
				gender: 'boy',
				age: '13-14',
				poolSize: 'SCY',
				length: distance
			},
			time
		);

	$: getStandard('free', 440);

	$: getHistory = (stroke) =>
		$history
			?.filter((doc) => doc.event.endsWith(`|${distance}|${stroke}`))
			.sort((a, b) => a.timestamp - b.timestamp)
			.map((it) => ({ x: it.timestamp.toDate(), y: it.time }));
</script>

{#if $swimmer === undefined}
	<svg
		aria-hidden="true"
		class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
		viewBox="0 0 100 101"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
			fill="currentColor"
		/>
		<path
			d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
			fill="currentFill"
		/>
	</svg>
{:else if $swimmer === null}
	<h1 class="text-4xl font-bold">Swimmer not found</h1>
{:else if $swimmer.role !== 'swimmer'}
	<h1 class="text-4xl font-bold">Not a swimmer</h1>
{:else}
	<div class="mx-auto flex max-w-screen-lg flex-col items-center py-8">
		<div class="flex items-center gap-x-4">
			<img src={$swimmer.photoURL} alt="Swimmer" class="h-24 w-24 rounded-full" />

			<div>
				<h2 class="text-xl font-bold">{$swimmer.name}</h2>
				<p>{$swimmer.email}</p>
			</div>
		</div>

		<div class="italic">{$swimmer.bio}</div>

		<div class="mt-8 w-full items-center rounded-3xl bg-base-300 p-8">
			<div class="flex justify-center gap-x-2">
				{#each [50, 100, 200, 500] as dist}
					<button
						class="rounded-lg bg-sky-400 px-4 py-2 text-black"
						class:bg-primary-gradient={distance === dist}
						class:text-white={distance === dist}
						on:click={() => {
							distance = dist;
							customDistance = null;
						}}>{dist} Y</button
					>
				{/each}
				<input
					class="w-24 rounded-lg bg-sky-400 px-4 py-2 text-black placeholder-gray-500"
					type="number"
					bind:value={customDistance}
					placeholder="Ex: 25"
				/>
			</div>

			<div class="flex w-full items-center gap-x-8">
				<SkillsChart
					im={pb('im', distance)}
					free={pb('free', distance)}
					back={pb('back', distance)}
					breast={pb('breast', distance)}
					fly={pb('fly', distance)}
					gender="boy"
					age="13-14"
					{distance}
				/>

				<table class="table min-w-80 max-w-md">
					<thead>
						<tr>
							<th>Stroke</th>
							<th>PB</th>
							<th>Standard Met</th>
						</tr>
					</thead>
					<tbody>
						{#each ['free', 'back', 'breast', 'fly', 'im'] as stroke}
							{@const _pb = pb(stroke, distance)}
							<tr>
								<td class="font-bold">{$t(`strokes.${stroke}`)}</td>
								<td class="min-w-32">{_pb ? formatTime(_pb) : '-'}</td>
								{#key distance}
									<td
										>{!_pb || getStandard(stroke, _pb) === TimeStandard.NONE
											? '-'
											: getStandard(stroke, _pb)}</td
									>
								{/key}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<HistoryChart
				free={getHistory('free')}
				back={getHistory('back')}
				breast={getHistory('breast')}
				fly={getHistory('fly')}
				im={getHistory('im')}
			/>
		</div>
	</div>
{/if}
