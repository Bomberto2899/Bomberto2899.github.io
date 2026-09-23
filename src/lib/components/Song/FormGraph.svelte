<script lang="ts">
	import type { Section } from '../../model/types';

	let { sections }: { sections: Section[] } = $props();

	// Mid-saturation hues that stay distinguishable in print and in greyscale-ish printers.
	const PALETTE = ['#2f6fb5', '#d9822b', '#3a9d5d', '#c0392b', '#8e5bb5', '#1f9aa3', '#b5872f', '#d45d9a'];
	const UNNAMED_COLOR = '#b8b8b8';

	let segments = $derived.by(() => {
		// Colour by name, in order of first appearance, so repeated sections (e.g. "Chorus") match.
		const colorByName = new Map<string, string>();
		return sections
			.filter((section) => section.bars.length > 0)
			.map((section) => {
				let color = UNNAMED_COLOR;
				if (section.name) {
					if (!colorByName.has(section.name)) {
						colorByName.set(section.name, PALETTE[colorByName.size % PALETTE.length]);
					}
					color = colorByName.get(section.name)!;
				}
				return { id: section.id, name: section.name, bars: section.bars.length, color };
			});
	});
</script>

{#if segments.length > 0}
	<div class="form-graph" aria-label="Song form">
		{#each segments as segment (segment.id)}
			<div
				class="segment"
				style:flex-grow={segment.bars}
				title="{segment.name || 'Unnamed section'}: {segment.bars} bar(s)"
			>
				<span class="name">
					{segment.name}
					<span class="bar-count">
						{segment.name ? '· ' : ''}{segment.bars} {segment.bars === 1 ? 'bar' : 'bars'}
					</span>
				</span>
				<span class="line" style:background={segment.color}></span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.form-graph {
		display: flex;
		gap: 2px;
		padding: 0.75rem 1rem 0;
	}

	.segment {
		flex-basis: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.name {
		font-size: 0.75rem;
		color: #444;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-height: 1em;
	}

	.bar-count {
		color: #888;
		font-variant-numeric: tabular-nums;
	}

	.line {
		display: block;
		height: 0.5rem;
		border-radius: 2px;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}
</style>
