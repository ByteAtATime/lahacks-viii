<script lang="ts">
	import { page } from '$app/stores';
	import type { SwimSet } from '$lib/ai';
	import { firestore } from '$lib/firebase';
	import GenerateSetModal from '$lib/components/GenerateSetModal.svelte';
	import { getContext } from 'svelte';
	import type { Context } from 'svelte-simple-modal';
	import { docStore } from 'sveltefire';
	import { Icon, Sparkles } from 'svelte-hero-icons';
	import SetPart from '$lib/components/SetPart.svelte';
	import SetInput from '$lib/components/SetInput.svelte';
	import { updateDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	const id = $page.params.id;

	$: set = docStore(firestore, `sets/${id}`);

	const { open } = getContext('simple-modal') as Context;

	const generateSet = () => {
		open(GenerateSetModal, { onSetGenerated: (newSet: SwimSet) => (set = newSet) });
	};

	const handleSubmit = async () => {
		await updateDoc(set.ref!, $set);

		goto(`/sets/${id}`);
	};
</script>

{#if $set === null}
	<p>Set not found</p>
{:else}
	<div class="mx-auto max-w-screen-lg">
		<form
			class="mx-auto flex max-w-screen-lg flex-col items-center gap-y-8 py-8"
			on:submit|preventDefault={handleSubmit}
		>
			<h1 class="text-4xl">Editing <span class="font-bold">{$set?.name ?? ''}</span></h1>

			<div class="flex w-full flex-col gap-y-8 rounded-2xl bg-base-300 p-8">
				<button on:click={generateSet} type="button" class="btn btn-square btn-primary self-end"
					><Icon src={Sparkles} class="w-8" /></button
				>

				<div>
					<h2 class="text-2xl font-bold">Warmup</h2>
					<SetPart setPart={$set?.set.warmup ?? []} />
					<SetInput addItem={(item) => ($set.set.warmup = [...$set.set.warmup, item])} />
				</div>

				<div>
					<h2 class="text-2xl font-bold">Main Set</h2>
					<SetPart setPart={$set?.set.main ?? []} />
					<SetInput addItem={(item) => ($set.set.main = [...$set.set.main, item])} />
				</div>

				<div>
					<h2 class="text-2xl font-bold">Cooldown</h2>
					<SetPart setPart={$set?.set.cooldown ?? []} />
					<SetInput addItem={(item) => ($set.set.cooldown = [...$set.set.cooldown, item])} />
				</div>

				<button class="btn btn-primary btn-lg">Save!</button>
			</div>
		</form>
	</div>
{/if}
