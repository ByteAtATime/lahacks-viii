<script>
	import { Home, Icon, ListBullet, UserGroup, Users } from 'svelte-hero-icons';
	import { t } from 'svelte-i18n';
</script>

{#if !window.location.pathname.startsWith('/onboarding')}
	<div class="w-64 rounded-r-2xl bg-base-300">
		<img src="/banner.svg" alt="SwimSetter" />

		<div class="mt-4 flex flex-col gap-y-2 px-4">
			<a
				class="flex items-center gap-x-1 rounded-lg px-3 py-2 text-xl transition-colors hover:bg-white/10"
				href="/"
			>
				<Icon src={Home} class="w-6" />
				{$t('nav.home')}
			</a>
			<a
				class="flex items-center gap-x-1 rounded-lg px-3 py-2 text-xl transition-colors hover:bg-white/10"
				href="/sets"
			>
				<Icon src={ListBullet} class="w-6" />
				{$t('nav.sets')}
			</a>
			<a
				class="flex items-center gap-x-1 rounded-lg px-3 py-2 text-xl transition-colors hover:bg-white/10"
				href="/swimmers"
			>
				<Icon src={UserGroup} class="w-6" />
				{$t('nav.swimmers')}
			</a>
		</div>
	</div>
{/if}
