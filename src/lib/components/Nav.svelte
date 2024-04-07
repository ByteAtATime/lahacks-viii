<script>
	import { page } from '$app/stores';
	import { Clock, Home, Icon, Language, ListBullet, UserGroup } from 'svelte-hero-icons';
	import { locale, t } from 'svelte-i18n';

	const toggleLocale = () => {
		$locale = $locale === 'en' ? 'zh' : 'en';
	};
</script>

{#if !$page.url.pathname.startsWith('/onboard')}
	<div class="fixed flex h-full w-64 flex-col rounded-r-2xl bg-base-300 p-4">
		<img src="/banner.svg" alt="SwimSetter" />

		<div class="mt-4 flex flex-col gap-y-2">
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
			<a
				class="flex items-center gap-x-1 rounded-lg px-3 py-2 text-xl transition-colors hover:bg-white/10"
				href="/timer"
			>
				<Icon src={Clock} class="w-6" />
				{$t('nav.timer')}
			</a>
		</div>

		<div class="mt-auto">
			<button
				class="rounded-xl px-4 py-2 transition-colors hover:bg-white/10"
				on:click={toggleLocale}><Icon src={Language} class="w-12" /></button
			>
		</div>
	</div>
{/if}
