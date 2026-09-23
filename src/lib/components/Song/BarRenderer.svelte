<script lang="ts">
	import type { Bar, Metadata } from '../../model/types';
	import { getBeatsPerBar } from '../../metadata/fieldRegistry';
	import { positionBar } from '../../beats/positionBar';
	import ChordLabel from '../Chord/ChordLabel.svelte';

	let { bar, barNumber, metadata }: { bar: Bar; barNumber: number; metadata: Metadata } = $props();

	let beatsPerBar = $derived(getBeatsPerBar(metadata));
	let positioned = $derived(positionBar(bar, beatsPerBar));

	function leftPercent(position: number): string {
		return `${((position - 1) / beatsPerBar) * 100}%`;
	}
</script>

<div class="bar" style:--beats-per-bar={beatsPerBar}>
	<div class="bar-number">{barNumber}</div>
	<div class="bar-track">
		{#each Array(beatsPerBar + 1) as _, i}
			<div class="gridline" style:left="{(i / beatsPerBar) * 100}%"></div>
		{/each}
		<div class="chord-row">
			{#each positioned.chords as positionedChord (positionedChord.item.id)}
				<div class="token" style:left={leftPercent(positionedChord.position)}>
					<ChordLabel chord={positionedChord.item} {metadata} />
				</div>
			{/each}
		</div>
		<div class="lyric-row">
			{#each positioned.lyrics as positionedLyric (positionedLyric.item.id)}
				<div class="token" style:left={leftPercent(positionedLyric.position)}>
					<span class="lyric">{positionedLyric.item.text}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.bar {
		display: flex;
		align-items: stretch;
		gap: 0.5rem;
		padding: 0.5rem 0;
		break-inside: avoid;
	}

	.bar-number {
		flex: 0 0 1.75rem;
		color: #888;
		font-size: 0.8rem;
		padding-top: 0.15rem;
		text-align: right;
	}

	.bar-track {
		position: relative;
		flex: 1 1 auto;
		min-width: calc(3rem * var(--beats-per-bar));
		min-height: 3.4rem;
		border-left: 1px solid #999;
		border-right: 1px solid #999;
		padding: 0.15rem 0.35rem;
	}

	.gridline {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: #eee;
	}

	.chord-row,
	.lyric-row {
		position: relative;
		height: 1.4rem;
	}

	.token {
		position: absolute;
		top: 0;
		white-space: nowrap;
	}

	.lyric {
		color: #333;
	}
</style>
