<script lang="ts">
	import type { SetPart } from '$lib/ai';
	import { formatTime } from '$lib/swimming';
	import { t } from 'svelte-i18n';

	export let setPart: SetPart;
</script>

<table class="table table-zebra">
	<tbody>
		{#each setPart as item}
			<tr>
				<td>
					{item.amount}
				</td>
				<td>
					{$t(`strokes.${item.stroke}`)}
				</td>
				<td>
					{item.distance}
				</td>
				<td>
					{item.interval ? formatTime(item.interval) : 'No interval'}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
