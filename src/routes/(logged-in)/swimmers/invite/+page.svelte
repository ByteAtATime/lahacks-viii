<script lang="ts">
	import { auth, firestore } from '$lib/firebase';
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { docStore, userStore } from 'sveltefire';
	import { derived, type Readable } from 'svelte/store';
	import { t } from 'svelte-i18n';

	const user = userStore(auth);
	const userData = docStore(firestore, `users/${$user?.uid}`);

	const team = derived([userData as Readable<any>], ([$userData]) =>
		docStore(firestore, `teams/${$userData?.team}`)
	);

	let copied = false;

	$: link = `${window.location.host}/join/${$team?.id}`;
</script>

<div class="mx-auto flex max-w-screen-lg flex-col items-center">
	<h1 class="text-4xl font-bold">{$t('swimmers.invite.title')}</h1>

	<QR data={link} class="max-w-lg" shape="circle" logo="/logo.svg" />

	<button
		class="mx-auto mt-4 w-min whitespace-nowrap rounded-2xl bg-blue-200 px-16 py-4 font-mono text-xl font-bold text-black"
		on:click={() => {
			navigator.clipboard.writeText(link);

			copied = true;

			setTimeout(() => {
				copied = false;
			}, 1500);
		}}>{copied ? $t('swimmers.invite.copied') : link}</button
	>
</div>
