<script lang="ts">
	import { songStore } from '../../state/songStore.svelte';
	import MetadataPanel from '../Metadata/MetadataPanel.svelte';
	import BarView from './BarView.svelte';

	let song = $derived(songStore.song);
</script>

<MetadataPanel metadata={song.metadata} />

<div class="bars">
	{#each song.bars as bar, i (bar.id)}
		<BarView {bar} barNumber={i + 1} metadata={song.metadata} />
	{/each}

	{#if song.bars.length === 0}
		<p class="empty">No bars yet — upload a leadsheet or add a bar to get started.</p>
	{/if}
</div>

<style>
	.bars {
		padding: 0.5rem 1rem 2rem;
	}

	.empty {
		color: #888;
		font-size: 0.9rem;
	}
</style>
