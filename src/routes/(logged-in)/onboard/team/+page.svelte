<script lang="ts">
	import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
	import { auth, firestore } from '$lib/firebase';
	import { userStore } from 'sveltefire';
	import { goto } from '$app/navigation';

	let name = '';
	let city = '';
	let description = '';

	const user = userStore(auth);

	const handleSubmit = async () => {
		const team = await addDoc(collection(firestore, 'teams'), {
			name,
			city,
			description,
			headCoach: $user!.uid,
			coaches: [],
			swimmers: []
		});

		await updateDoc(doc(firestore, `users/${$user!.uid}`), {
			team: team.id
		});

		goto('/onboard/set');
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="flex w-full max-w-sm flex-col gap-y-4">
	<h1 class="text-4xl font-bold">Team Info</h1>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Team Name</span>
		</div>
		<input
			type="text"
			placeholder="Hogwarts"
			bind:value={name}
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">City</span>
		</div>
		<input
			type="text"
			placeholder="London, Hogwarts"
			bind:value={city}
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Description</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-24"
			placeholder="Hogwarts is a magical school for..."
			bind:value={description}
		/>
	</label>

	<button class="btn btn-primary">Next</button>
</form>
