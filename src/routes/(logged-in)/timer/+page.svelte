<script lang="ts">
	import UploadTimesModal from '$lib/components/UploadTimesModal.svelte';
	import { formatTime } from '$lib/swimming';
	import { getContext, onMount } from 'svelte';
	import type { Context } from 'svelte-simple-modal';
	import { t } from 'svelte-i18n';

	let lanes = 5;
	let startTime: number | null = null;
	let uploaded = false;
	$: times = Array.from({ length: lanes }, () => 0);

	$: elapsed = Date.now() - (startTime ?? Date.now());

	onMount(() => {
		setInterval(() => {
			if (startTime !== null && !uploaded) {
				elapsed = Date.now() - startTime;
			}
		}, 1000 / 60);
	});

	const { open } = getContext('simple-modal') as Context;

	$: {
		if (times.every((time) => time !== 0)) {
			open(UploadTimesModal, { times });
			uploaded = true;
		}
	}
</script>

<div class="mx-auto flex max-w-screen-lg flex-col gap-y-4">
	<h1 class="text-4xl font-bold">{$t('timer.title')}</h1>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">{$t('timer.lanes')}</span>
		</div>
		<input type="number" bind:value={lanes} class="input input-bordered w-full" min="1" max="20" />
	</label>

	<button
		on:click={() => (startTime = Date.now())}
		class="btn btn-primary w-full"
		class:opacity-0={startTime !== null}>{$t('timer.start')}</button
	>

	<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] justify-around gap-8">
		{#each Array.from({ length: lanes }) as _, i}
			<button
				class="btn btn-square btn-primary flex aspect-square items-center justify-center p-[45%] text-6xl"
				on:click={() => (times[i] = Date.now() - (startTime ?? Date.now()))}
				disabled={startTime === null || times[i] !== 0}
			>
				{i + 1}
			</button>
		{/each}
	</div>

	<p class="text-center text-4xl font-bold">{formatTime(elapsed)}</p>

	<button
		class="btn btn-secondary"
		on:click={() => {
			open(UploadTimesModal, { times });
			uploaded = true;
		}}>{$t('timer.stop')}</button
	>
</div>
