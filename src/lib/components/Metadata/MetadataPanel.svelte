<script lang="ts">
	import type { Metadata } from '../../model/types';
	import { metadataFieldRegistry } from '../../metadata/fieldRegistry';
	import { songStore } from '../../state/songStore.svelte';
	import { notationMode } from '../../state/notationMode.svelte';
	import { viewOptions } from '../../state/viewOptions.svelte';
	import MetadataFieldInput from './MetadataFieldInput.svelte';

	let { metadata }: { metadata: Metadata } = $props();
</script>

<div class="panel">
	{#each metadataFieldRegistry as field (field.id)}
		<MetadataFieldInput
			{field}
			value={metadata[field.id] ?? field.serialize(field.default)}
			onCommit={(raw) => songStore.updateMetadataField(field.id, raw)}
		/>
	{/each}

	<div class="field">
		<span class="label">Notation display</span>
		<div class="toggle">
			<button
				class:active={notationMode.current === 'literal'}
				onclick={() => notationMode.set('literal')}
			>
				Literal
			</button>
			<button
				class:active={notationMode.current === 'roman'}
				onclick={() => notationMode.set('roman')}
			>
				Roman numerals
			</button>
		</div>
	</div>

	<div class="field">
		<span class="label">Sections</span>
		<div class="toggle">
			<button
				class:active={viewOptions.showSections}
				onclick={() => viewOptions.setShowSections(true)}
			>
				Show
			</button>
			<button
				class:active={!viewOptions.showSections}
				onclick={() => viewOptions.setShowSections(false)}
			>
				Hide
			</button>
		</div>
	</div>

	<div class="field">
		<span class="label">Form graph</span>
		<div class="toggle">
			<button
				class:active={viewOptions.showFormGraph}
				onclick={() => viewOptions.setShowFormGraph(true)}
			>
				On
			</button>
			<button
				class:active={!viewOptions.showFormGraph}
				onclick={() => viewOptions.setShowFormGraph(false)}
			>
				Off
			</button>
		</div>
	</div>
</div>

<style>
	.panel {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
		padding: 0.75rem 1rem;
		background: #f7f8fa;
		border-bottom: 1px solid #ddd;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		font-size: 0.85rem;
	}

	.label {
		color: #555;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.toggle {
		display: flex;
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
	}

	.toggle button {
		border: none;
		background: white;
		padding: 0.3rem 0.6rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.toggle button.active {
		background: #1a4d8f;
		color: white;
	}
</style>
