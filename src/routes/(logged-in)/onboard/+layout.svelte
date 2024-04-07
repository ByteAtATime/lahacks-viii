<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center">
	<div class="flex w-full flex-col items-center gap-y-8">
		{#key $page}
			<ul class="steps absolute top-20 w-1/4">
				<li class="step step-primary">Personal<br />Info</li>
				<li class="step" class:step-primary={window.location.pathname.endsWith('team')}>
					Team<br />Details
				</li>
				<li class="step" class:step-primary={window.location.pathname.endsWith('set')}>
					Create<br />Set
				</li>
			</ul>
		{/key}

		<slot />
	</div>

	<img class="h-screen max-w-screen-lg object-cover" src="/onboard.jpg" alt="Swimmers diving" />
</div>
