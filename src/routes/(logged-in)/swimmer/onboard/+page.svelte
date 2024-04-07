<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth, firestore } from '$lib/firebase';
	import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
	import { userStore } from 'sveltefire';

	const user = userStore(auth);

	let name = $user?.displayName;
	let email = $user?.email;
	let bio = '';

	const signUp = async () => {
		await setDoc(
			doc(firestore, `users/${$user?.uid}`),
			{
				name,
				email,
				bio,
				photoURL: $user?.photoURL,
				role: 'swimmer',
				team: $page.url.searchParams.get('team')
			},
			{ merge: true }
		);

		await updateDoc(doc(firestore, `teams/${$page.url.searchParams.get('team')}`), {
			swimmers: arrayUnion($user?.uid)
		});

		goto(`/swimmer/${$user?.uid}`);
	};
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-y-2">
	<h1 class="text-4xl font-bold">Personal Info</h1>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input type="text" placeholder="Harry Potter" class="input input-bordered w-full" />
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input type="email" placeholder="potter@hogwarts.com" class="input input-bordered w-full" />
	</label>

	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Bio</span>
		</div>
		<textarea
			placeholder="I am a wizard..."
			class="textarea textarea-bordered h-24 w-full"
			bind:value={bio}
		></textarea>
	</label>

	<button class="btn btn-primary mt-4 w-full" on:click={signUp}>Sign up</button>
</div>
