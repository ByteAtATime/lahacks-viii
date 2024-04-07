<script>
	import { FirebaseApp, userStore } from 'sveltefire';
	import '../app.pcss';
	import { auth, firestore } from '$lib/firebase';
	import '$lib/i18n';
	import Modal from 'svelte-simple-modal';
	import Nav from '$lib/components/Nav.svelte';
</script>

<FirebaseApp {auth} {firestore}>
	<Modal classWindow="!bg-base-100 !text-base-content">
		<div class="flex min-h-screen items-stretch">
			<Nav />

			<div class="w-full">
				<slot />
			</div>
		</div>
	</Modal>
</FirebaseApp>
