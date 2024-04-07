<script lang="ts">
	import type { SetPart } from '$lib/ai';

	export let setPart: SetPart;
</script>

<table class="table table-zebra">
	<tbody>
		{#each setPart as item}
			<tr>
				<td>
					<input
						type="number"
						bind:value={item.amount}
						class="input input-bordered w-24"
						min="0"
						step="1"
						required
					/>
				</td>
				<td>
					<select bind:value={item.stroke} class="select select-bordered" required>
						<option value="free">Freestyle</option>
						<option value="back">Backstroke</option>
						<option value="breast">Breaststroke</option>
						<option value="fly">Butterfly</option>
						<option value="im">IM</option>
					</select>
				</td>
				<td>
					<input
						type="number"
						bind:value={item.distance}
						class="input input-bordered w-48"
						min="0"
						step="25"
						required
					/>
				</td>
				<td>
					<input
						type="number"
						on:change={(e) => (item.interval = e.target.valueAsNumber * 1000)}
						class="input input-bordered w-48"
						min="0"
						step="5"
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
