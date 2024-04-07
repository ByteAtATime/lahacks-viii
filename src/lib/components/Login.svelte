<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AppleLogo from '$lib/components/AppleLogo.svelte';
	import GoogleLogo from '$lib/components/GoogleLogo.svelte';
	import { auth, firestore } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import toast from 'svelte-french-toast';

	const provider = new GoogleAuthProvider();

	const signInGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, provider);
			const userDoc = await getDoc(doc(firestore, `users/${user.user.uid}`));

			if (!userDoc.exists()) {
				goto('/onboard');
			}
		} catch (e) {
			console.error(e);
			toast.error('Failed to sign in!');
		}
	};
</script>

<div class="mx-auto flex min-h-screen max-w-screen-md flex-col items-center justify-center">
	<div class="flex flex-col gap-y-4">
		<h1 class="text-4xl font-bold">Login</h1>

		<div class="flex flex-col items-center gap-4 md:flex-row">
			<div class="flex flex-col gap-y-2">
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Email</span>
					</div>
					<input
						type="email"
						placeholder="potter@hogwarts.com"
						class="input input-bordered w-full max-w-xs"
					/>
				</label>
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">Password</span>
					</div>
					<input
						type="password"
						placeholder="••••••••••••"
						class="input input-bordered w-full max-w-xs"
					/>
				</label>
				<button
					class="bg-primary-gradient shadow-glow btn btn-primary mt-4 border-0 text-white shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]"
					>Login</button
				>
			</div>

			<div class="divider md:divider-horizontal">OR</div>

			<div class="flex w-full flex-col items-stretch gap-y-4 md:w-60">
				<button class="btn btn-ghost w-full bg-white text-black" on:click={signInGoogle}
					><GoogleLogo /> Sign in with Google</button
				>
				<button class="btn btn-ghost w-full bg-white text-black"
					><AppleLogo /> Sign in With Apple</button
				>
			</div>
		</div>
	</div>
</div>
