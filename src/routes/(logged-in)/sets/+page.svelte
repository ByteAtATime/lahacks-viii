<script lang="ts">
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
</script>

<div class="mx-auto flex max-w-screen-lg flex-col py-8">
	<h1 class="mb-6 text-2xl font-bold">{$t('sets.title')}</h1>

	<a class="btn btn-primary flex gap-x-1 self-end" href="/createSet"
		><Icon src={Plus} class="w-8" />{$t('sets.new')}</a
	>

	<div class="grid w-full grid-cols-3 gap-x-4">
		{#each $upcomingSets as set}
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
	</div>
</div>
