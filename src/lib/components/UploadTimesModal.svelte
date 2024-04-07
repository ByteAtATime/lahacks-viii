<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, firestore } from '$lib/firebase';
	import { formatTime, type Event } from '$lib/swimming';
	import { addTime } from '$lib/user';
	import { getContext } from 'svelte';
	import type { Context } from 'svelte-simple-modal';
	import { derived, readable } from 'svelte/store';
	import { docStore, userStore } from 'sveltefire';
	import { t } from 'svelte-i18n';

	export let times: number[];
	let assignedSwimmers: (string | null)[] = times.map(() => null);
	let event: Event = {
		length: 50,
		stroke: 'free',
		poolSize: 'SCY',
		gender: 'boy',
		age: '13-14'
	};

	const user = userStore(auth);
	$: userData = docStore(firestore, `users/${$user?.uid}`);
	$: teamData = docStore(firestore, `teams/${$userData?.team}`);
	$: swimmersIds = $teamData?.swimmers ?? [];
	$: swimmers = derived(
		swimmersIds.map((id) =>
			derived([docStore(firestore, `users/${id}`), readable(id)], ([doc, id]) => ({ ...doc, id }))
		),
		($swimmers) => $swimmers.filter((swimmer) => swimmer)
	);

	const { close } = getContext('simple-modal') as Context;

	const handleSave = async () => {
		for (let i = 0; i < times.length; i++) {
			if (times[i] && assignedSwimmers[i]) {
				await addTime(assignedSwimmers[i]!, event, times[i]);
			}
		}

		close();

		goto('/');
	};

	$: console.log(assignedSwimmers);
</script>

<h2 class="text-2xl font-bold">{$t('timer.upload.title')}</h2>

<select bind:value={event.stroke} class="select select-bordered">
	<option value="free">{$t('strokes.free')}</option>
	<option value="back">{$t('strokes.back')}</option>
	<option value="breast">{$t('strokes.breast')}</option>
	<option value="fly">{$t('strokes.fly')}</option>
	<option value="im">{$t('strokes.im')}</option>
</select>

<input type="number" bind:value={event.length} class="input input-bordered" min="25" step="25" />

<table class="table table-zebra">
	<thead>
		<tr>
			<th>{$t('timer.upload.lane')}</th>
			<th>{$t('timer.upload.time')}</th>
			<th>{$t('timer.upload.swimmer')}</th>
		</tr>
	</thead>
	<tbody>
		{#each times as time, i}
			<tr>
				<td>{i + 1}</td>
				<td>{time ? formatTime(time) : $t('timer.upload.dnf')}</td>
				<td>
					{#if time}
						<select bind:value={assignedSwimmers[i]} class="select select-bordered">
							<option value={null} disabled>Select a swimmer</option>
							{#each $swimmers ?? [] as swimmer}
								<option value={swimmer.id}>{swimmer.name}</option>
							{/each}
						</select>
					{:else}
						-
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<button class="btn btn-primary" on:click={handleSave}>{$t('timer.upload.save')}</button>
