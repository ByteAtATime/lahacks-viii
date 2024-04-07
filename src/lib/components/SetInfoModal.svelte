<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SwimSet } from '$lib/ai';
	import { auth, firestore } from '$lib/firebase';
	import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
	import { getContext } from 'svelte';
	import type { Context } from 'svelte-simple-modal';
	import { docStore, userStore } from 'sveltefire';

	export let set: SwimSet;

	const user = userStore(auth);
	$: userData = docStore(firestore, `users/${$user?.uid}`);

	let name = '';
	let timestamp = '';
	let notes = '';

	const { close } = getContext('simple-modal') as Context;

	const handleSubmit = async () => {
		const setDoc = await addDoc(collection(firestore, `sets`), {
			set,
			name,
			timestamp: new Date(timestamp),
			notes
		});

		await updateDoc(doc(firestore, `teams/${$userData?.team}`), {
			sets: arrayUnion(setDoc.id)
		});

		goto(`/sets/${setDoc.id}`);

		close();
	};
</script>

<h2 class="text-2xl font-bold">Set Info</h2>

<form
	class="flex w-full flex-col items-center gap-y-8 py-8"
	on:submit|preventDefault={handleSubmit}
>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input
			type="text"
			placeholder="Death Week - Tuesday"
			class="input input-bordered w-full"
			bind:value={name}
			required
		/>
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Date/Time</span>
		</div>
		<input
			type="datetime-local"
			class="input input-bordered w-full"
			bind:value={timestamp}
			required
		/>
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Notes</span>
		</div>
		<textarea
			class="textarea textarea-bordered w-full"
			placeholder="This set is going to be a killer!"
			bind:value={notes}
		/>
	</label>

	<button class="btn btn-primary btn-lg">Create!</button>
</form>
