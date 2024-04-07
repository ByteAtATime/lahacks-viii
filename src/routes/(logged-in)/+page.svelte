<script>
	import { date, t, time } from 'svelte-i18n';
	import { docStore, userStore } from 'sveltefire';
	import { auth, firestore } from '$lib/firebase';
	import {
		Icon,
		Plus,
		ArrowUp,
		ArrowDown,
		ArrowUpRight,
		ArrowDownRight,
		ArrowRightCircle
	} from 'svelte-hero-icons';
	import { derived } from 'svelte/store';

	const user = userStore(auth);
	$: userData = docStore(firestore, `users/${$user?.uid}`);
	$: teamData = docStore(firestore, `teams/${$userData?.team}`);

	$: isCoach = $userData && $userData.role === 'coach';

	$: team = docStore(firestore, `teams/${$userData?.team}`);

	$: upcomingSets = derived(
		($teamData?.sets ?? []).map((set) =>
			derived([docStore(firestore, `sets/${set}`)], ([_set]) => ({ ..._set, id: set }))
		),
		($sets) => {
			return $sets
				.filter((set) => set)
				.map((set) => ({ ...set, timestamp: set.timestamp?.toDate() }))
				.filter((set) => set.timestamp > Date.now())
				.sort((a, b) => a.timestamp - b.timestamp);
		}
	);

	const leastPracticed = {
		stroke: 'free',
		type: 'drill/technique'
	};

	const stats = {
		swimmerDiff: 5,
		averageTimeDiff: -0.83
	};
</script>

<div class="mx-auto flex max-w-screen-lg flex-col items-center gap-y-16 py-16">
	<div class="flex flex-col items-center gap-y-2">
		<h1 class="text-4xl">
			{@html $t('home.welcome', { values: { name: $userData?.name } })}
		</h1>

		{#if isCoach}
			<p>{@html $t('home.currently_coaching', { values: { team: $team?.name } })}</p>
		{/if}
	</div>

	<div class="flex w-full flex-col items-center gap-y-4">
		<h2 class="text-3xl font-bold">{$t('home.upcoming.title')}</h2>

		<div class="grid w-full grid-cols-3 gap-x-4">
			{#each $upcomingSets?.slice(0, 2) as set}
				<a href="/sets/{set.id}">
					<div
						class="card h-full w-80 bg-base-300 shadow-xl transition-transform hover:-translate-y-4"
					>
						<div class="card-body">
							<h3 class="card-title">{set.name}</h3>
							<div>
								<p>{$date(set.timestamp, { format: 'medium' })}</p>
								<p>{$time(set.timestamp)}</p>
							</div>
						</div>
					</div>
				</a>
			{/each}

			<a href="/createSet">
				<div
					class="hover:shadow-3xl card w-80 bg-primary shadow-xl transition-transform hover:-translate-y-4"
				>
					<div class="card-body flex items-center justify-center">
						<Icon src={Plus} class="w-32 text-primary-content" />
					</div>
				</div>
			</a>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-x-8">
		<div class="flex flex-col gap-y-4 rounded-2xl bg-base-300 p-8">
			<h2 class="text-2xl font-bold">{$t('home.least.title')}</h2>
			<div class="grid grid-cols-2 gap-x-4">
				<div class="flex flex-col items-center rounded-xl bg-neutral p-6 text-neutral-content">
					<p class="text-2xl font-bold">{$t(`strokes.${leastPracticed.stroke}`)}</p>
					<p class="text-gray-400">{$t('home.least.stroke')}</p>
				</div>
				<div class="flex flex-col items-center rounded-xl bg-neutral p-6 text-neutral-content">
					<p class="text-2xl font-bold">{$t(`types.${leastPracticed.type}`)}</p>
					<p class="text-gray-400">{$t('home.least.type')}</p>
				</div>
			</div>
			<button class="btn btn-secondary flex"
				>{$t('home.least.breakdown')} <Icon src={ArrowRightCircle} class="w-6" /></button
			>
		</div>
		<div class="flex flex-col gap-y-4 rounded-2xl bg-base-300 p-8">
			<h2 class="text-2xl font-bold">{$t('home.stats.title')}</h2>
			<div class="grid grid-cols-2 gap-x-4">
				<div class="flex flex-col items-center rounded-xl bg-neutral p-6 text-neutral-content">
					<div class="flex items-center gap-x-1">
						<Icon
							src={stats.swimmerDiff >= 0 ? ArrowUp : ArrowDown}
							class="w-8 {stats.swimmerDiff >= 0 ? 'text-success' : 'text-error'}"
						/>

						<p class="text-sm">
							{@html $t('home.stats.swimmer_diff', {
								values: {
									diff:
										stats.swimmerDiff > 0 ? `+${stats.swimmerDiff}` : stats.swimmerDiff.toString(),
									class: stats.swimmerDiff >= 0 ? 'text-success' : 'text-error'
								}
							})}
						</p>
					</div>
					<p class="text-gray-400">{$t('home.stats.swimmers')}</p>
				</div>
				<div class="flex flex-col items-center rounded-xl bg-neutral p-6 text-neutral-content">
					<div class="flex items-center gap-x-1">
						<Icon
							src={stats.averageTimeDiff >= 0 ? ArrowUpRight : ArrowDownRight}
							class="w-8 {stats.averageTimeDiff <= 0 ? 'text-success' : 'text-error'}"
						/>

						<p class="text-sm">
							{@html $t('home.stats.time_diff', {
								values: {
									diff:
										stats.averageTimeDiff > 0
											? `+${stats.averageTimeDiff}`
											: stats.averageTimeDiff.toString(),
									class: stats.averageTimeDiff <= 0 ? 'text-success' : 'text-error'
								}
							})}
						</p>
					</div>
					<p class="text-gray-400">{$t('home.stats.time')}</p>
				</div>
			</div>
			<a class="btn btn-secondary flex" href="/swimmers"
				>{$t('home.stats.view')} <Icon src={ArrowRightCircle} class="w-6" /></a
			>
		</div>
	</div>
</div>
