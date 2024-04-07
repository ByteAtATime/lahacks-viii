<script lang="ts">
	import { userStore } from 'sveltefire';
	import { auth, firestore } from '$lib/firebase';
	import { doc, setDoc, updateDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	const user = userStore(auth);

	let name = $user?.displayName ?? '';
	let email = $user?.email ?? '';

	const handleSubmit = async () => {
		await setDoc(
			doc(firestore, `users/${$user!.uid}`),
			{
				name,
				email,
				role: 'coach'
			},
			{
				merge: true
			}
		);

		goto('/onboard/team');
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="flex w-full max-w-sm flex-col gap-y-4">
	<h1 class="text-4xl font-bold">Personal Info</h1>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input
			type="text"
			placeholder="Harry Potter"
			bind:value={name}
			class="input input-bordered w-full"
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input
			type="email"
			placeholder="potter@hogwarts.com"
			bind:value={email}
			class="input input-bordered w-full"
		/>
	</label>

	<button class="btn btn-primary">Next</button>
</form>
