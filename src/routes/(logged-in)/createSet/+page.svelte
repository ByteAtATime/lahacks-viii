<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SwimSet } from '$lib/ai';
	import GenerateSetModal from '$lib/components/GenerateSetModal.svelte';
	import SetInfoModal from '$lib/components/SetInfoModal.svelte';
	import SetInput from '$lib/components/SetInput.svelte';
	import SetPart from '$lib/components/SetPart.svelte';
	import { auth, firestore } from '$lib/firebase';
	import { addDoc, collection } from 'firebase/firestore';
	import { getContext } from 'svelte';
	import { Icon, Plus, Sparkles } from 'svelte-hero-icons';
	import type { Context } from 'svelte-simple-modal';
	import { docStore, userStore } from 'sveltefire';
	import { t } from 'svelte-i18n';

	const user = userStore(auth);
	$: userData = docStore(firestore, `users/${user.uid}`);

	let set: SwimSet = {
		warmup: [],
		main: [],
		cooldown: []
	};

	const { open } = getContext('simple-modal') as Context;

	const generateSet = () => {
		open(GenerateSetModal, { onSetGenerated: (newSet: SwimSet) => (set = newSet) });
	};

	const handleSubmit = async () => {
		open(SetInfoModal, { set });
	};
</script>

<form
	class="mx-auto flex max-w-screen-lg flex-col items-center gap-y-8 py-8"
	on:submit|preventDefault={handleSubmit}
>
	<h1 class="text-4xl font-bold">{$t('set.create.title')}</h1>

	<div class="flex w-full flex-col gap-y-8 rounded-2xl bg-base-300 p-8">
		<button on:click={generateSet} type="button" class="btn btn-square btn-primary self-end"
			><Icon src={Sparkles} class="w-8" /></button
		>

		<div>
			<h2 class="text-2xl font-bold">{$t('set.warmup')}</h2>
			<SetPart setPart={set.warmup} />
			<SetInput addItem={(item) => (set.warmup = [...set.warmup, item])} />
		</div>

		<div>
			<h2 class="text-2xl font-bold">{$t('set.main')}</h2>
			<SetPart setPart={set.main} />
			<SetInput addItem={(item) => (set.main = [...set.main, item])} />
		</div>

		<div>
			<h2 class="text-2xl font-bold">{$t('set.cooldown')}</h2>
			<SetPart setPart={set.cooldown} />
			<SetInput addItem={(item) => (set.cooldown = [...set.cooldown, item])} />
		</div>

		<button class="btn btn-primary btn-lg">{$t('set.create.submit')}</button>
	</div>
</form>
