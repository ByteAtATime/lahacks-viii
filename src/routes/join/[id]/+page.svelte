<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GoogleLogo from '$lib/components/GoogleLogo.svelte';
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { docStore } from 'sveltefire';

	const id = $page.params.id;

	const team = docStore(firestore, `teams/${id}`);

	const signIn = async () => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);

		goto('/swimmers/onboard?team=' + id);
	};
</script>

<div class="flex flex-col items-center gap-y-2 py-8">
	<h1 class="text-4xl font-bold">Join team</h1>

	<p>You are joining the team <span class="font-bold">{$team?.name}</span></p>

	<button class="btn btn-ghost mt-4 w-full max-w-sm bg-white text-black" on:click={signIn}
		><GoogleLogo /> Sign in with Google</button
	>
</div>
