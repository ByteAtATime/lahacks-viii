<script lang="ts">
	import { SignedIn, SignedOut, userStore } from 'sveltefire';
	import { auth } from '$lib/firebase';
	import Login from '$lib/components/Login.svelte';
</script>

<SignedOut>
	<Login />
</SignedOut>

<SignedIn>
	<slot />
</SignedIn>
