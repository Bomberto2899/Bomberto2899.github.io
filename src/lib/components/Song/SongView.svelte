<script lang="ts">
	import { songStore } from '../../state/songStore.svelte';
	import MetadataPanel from '../Metadata/MetadataPanel.svelte';
	import SongHeader from './SongHeader.svelte';
	import SectionView from './SectionView.svelte';
	import FormGraph from './FormGraph.svelte';
	import { viewOptions } from '../../state/viewOptions.svelte';

	let song = $derived(songStore.song);

	/** Bar numbers run continuously across sections. */
	let firstBarNumbers = $derived.by(() => {
		let next = 1;
		return song.sections.map((section) => {
			const first = next;
			next += section.bars.length;
			return first;
		});
	});
</script>

<SongHeader metadata={song.metadata} />
{#if viewOptions.showFormGraph}
	<FormGraph sections={song.sections} />
{/if}
<MetadataPanel metadata={song.metadata} />

<div class="bars">
	{#each song.sections as section, i (section.id)}
		<SectionView {section} firstBarNumber={firstBarNumbers[i]} metadata={song.metadata} />
	{/each}

	{#if song.sections.length === 0}
		<p class="empty">No bars yet — upload a leadsheet or add a section or bar to get started.</p>
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
