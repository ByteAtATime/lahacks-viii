<script lang="ts">
	import { auth, firestore } from '$lib/firebase';
	import { ArrowDownRight, ArrowUpRight, Icon, Plus } from 'svelte-hero-icons';
	import { collectionStore, docStore, userStore } from 'sveltefire';
	import { t } from 'svelte-i18n';
	import { derived, readable } from 'svelte/store';

	const user = userStore(auth);
	const userData = docStore(firestore, `users/${$user?.uid}`);
	$: team = docStore(firestore, `teams/${$userData?.team}`);

	const date = new Date();

	const swimmerWithDiff = (swimmer) =>
		derived(
			[
				docStore(firestore, `users/${swimmer}`),
				docStore(
					firestore,
					`users/${swimmer}/monthly/${date.getFullYear()}-${date.getMonth() + 1}`
				),
				docStore(firestore, `users/${swimmer}/monthly/${date.getFullYear()}-${date.getMonth()}`)
			],
			([user, monthly, lastMonthly]) => ({ user, monthly, lastMonthly, id: swimmer })
		);

	$: swimmers = derived($team?.swimmers.map(swimmerWithDiff) ?? readable([]), (swimmers) =>
		swimmers.filter((swimmer) => swimmer)
	);
</script>

<div class="mx-auto w-full max-w-screen-lg">
	<h1 class="text-4xl font-bold">{$t('swimmers.title')}</h1>

	<a href="/swimmers/invite">
		<div class="flex justify-center">
			<div class="max-w-1/5 flex flex-col items-center">
				<Icon src={Plus} class="w-24" />
				{$t('swimmers.invite')}
			</div>
		</div></a
	>

	<div class="mt-8 w-full rounded-3xl bg-base-300 p-8">
		{#if swimmers}
			{#each $swimmers as swimmer}
				{#if swimmer}
					<a href="/swimmers/{swimmer.id}">
						<div
							class="grid transform-gpu grid-cols-3 rounded-xl bg-neutral px-8 py-4 transition-all hover:-translate-y-2 hover:shadow-xl"
						>
							<p>{swimmer.user?.name}</p>
							<p class="flex items-center gap-x-2">
								{#if swimmer.monthly && swimmer.lastMonthly}
									{@const thisMonth = swimmer.monthly.times}
									{@const lastMonth = swimmer.lastMonthly.times}
									{@const diff =
										thisMonth.reduce((a, b) => a + b) / thisMonth.length -
										lastMonth.reduce((a, b) => a + b) / lastMonth.length}
									<Icon
										src={diff < 0 ? ArrowDownRight : ArrowUpRight}
										class="w-8 {diff > 0 ? 'text-error' : 'text-success'}"
									/>

									<span>
										{@html $t('swimmers.diff', {
											values: {
												diff: (diff / 1000).toFixed(2),
												class: diff < 0 ? 'text-success' : 'text-error'
											}
										})}
									</span>
								{/if}
							</p>
							<p>
								<a href="mailto:{swimmer.user?.email}" class="underline">{swimmer.user?.email}</a>
							</p>
						</div>
					</a>
				{/if}
			{/each}
		{:else}
			<p>{$t('swimmers.none')}</p>
		{/if}
	</div>
</div>
