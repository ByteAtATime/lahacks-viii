<script lang="ts">
	import type { SwimSet } from '$lib/ai';
	import { getContext } from 'svelte';
	import { ExclamationTriangle, Icon, Sparkles } from 'svelte-hero-icons';
	import type { Context } from 'svelte-simple-modal';

	export let onSetGenerated: (set: SwimSet) => void;

	let error = false;
	let isLoading = false;

	let prompt = '';
	let time = '';
	let model = 'mock';

	const { close } = getContext('simple-modal') as Context;

	const handleSubmit = async () => {
		isLoading = true;

		const res = await fetch(`/api/generateSet?prompt=${prompt}&time=${time}&model=${model}`);

		if (!res.ok) {
			error = true;
			isLoading = false;
			return;
		}

		const set = await res.json();

		onSetGenerated(set);

		close();
	};
</script>

<h1 class="text-4xl font-bold">Generate Set</h1>

<div class="mb-4 mt-4 flex gap-x-2 rounded-lg bg-warning p-4 text-yellow-700" role="alert">
	<Icon src={ExclamationTriangle} class="w-6 text-yellow-700" solid />
	<div>
		<span class="font-bold">Warning:</span>
		Generating a set will overwrite your current set
	</div>
</div>

<form class="flex flex-col gap-y-2" on:submit|preventDefault={handleSubmit}>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Prompt</span>
		</div>
		<input
			bind:value={prompt}
			type="text"
			placeholder="Sprint fly set"
			class="input input-bordered w-full"
			disabled={isLoading}
		/>
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Time</span>
		</div>
		<input
			bind:value={time}
			type="text"
			placeholder="1 hour"
			class="input input-bordered w-full"
			disabled={isLoading}
		/>
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">AI Model</span>
		</div>
		<select bind:value={model} class="select select-bordered">
			<option value="mock">Mock</option>
			<option value="mistral">Mistral</option>
			<option value="gemini">Gemini</option>
		</select>
	</label>

	{#if error}
		<p class="text-error">Failed to generate set</p>
	{/if}

	<button class="btn btn-primary mt-4" disabled={isLoading}>
		{#if isLoading}
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
		{:else}
			<Icon src={Sparkles} class="w-8" />
		{/if}
		Generate Set
	</button>
</form>
