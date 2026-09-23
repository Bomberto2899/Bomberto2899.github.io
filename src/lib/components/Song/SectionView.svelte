<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Metadata, Section } from '../../model/types';
	import { songStore } from '../../state/songStore.svelte';
	import BarView from './BarView.svelte';

	let {
		section,
		firstBarNumber,
		metadata
	}: { section: Section; firstBarNumber: number; metadata: Metadata } = $props();

	let collapsed = $state(false);
	let editing = $state(false);
	let draft = $state('');
	let inputEl = $state<HTMLInputElement | undefined>(undefined);

	async function startRename() {
		draft = section.name;
		editing = true;
		await tick();
		inputEl?.focus();
		inputEl?.select();
	}

	function commitRename() {
		if (!editing) return;
		editing = false;
		songStore.renameSection(section.id, draft.trim());
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			commitRename();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			editing = false;
		}
	}

	function deleteSection() {
		const label = section.name ? `"${section.name}"` : 'this section';
		if (
			section.bars.length === 0 ||
			confirm(`Delete ${label} and its ${section.bars.length} bar(s)?`)
		) {
			songStore.deleteSection(section.id);
		}
	}

	onMount(() => {
		if (songStore.sectionAwaitingRename === section.id) {
			songStore.clearSectionAwaitingRename();
			startRename();
		}
	});
</script>

<section class="section" class:collapsed>
	<div class="section-header" class:unnamed={!section.name && !editing}>
		<button
			class="collapse"
			onclick={() => (collapsed = !collapsed)}
			title={collapsed ? 'Expand this section' : 'Minimise this section'}
			aria-expanded={!collapsed}
		>
			{collapsed ? '▸' : '▾'}
		</button>
		{#if editing}
			<input
				bind:this={inputEl}
				bind:value={draft}
				class="name-input"
				placeholder="Section name"
				onblur={commitRename}
				onkeydown={onKeydown}
			/>
		{:else}
			<button class="name" onclick={startRename} title="Rename this section">
				{section.name || '+ Name section'}
			</button>
		{/if}
		{#if collapsed}
			<span class="summary">
				{section.bars.length} {section.bars.length === 1 ? 'bar' : 'bars'}
			</span>
		{/if}
		<button
			class="section-action"
			onclick={() => songStore.duplicateSection(section.id)}
			title="Duplicate this section"
		>
			⧉
		</button>
		<button class="section-action delete-section" onclick={deleteSection} title="Delete this section">
			&times;
		</button>
	</div>

	<div class="section-body">
		{#each section.bars as bar, i (bar.id)}
			<BarView {bar} barNumber={firstBarNumber + i} {metadata} />
		{/each}

		<button class="add-bar" onclick={() => songStore.addBar(section.id)}>+ Add bar</button>
	</div>
</section>

<style>
	.section {
		margin-top: 0.75rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding-left: 0.75rem;
	}

	.name {
		border: none;
		background: transparent;
		padding: 0.1rem 0.2rem;
		font-size: 1rem;
		font-weight: 700;
		color: #1a1a1a;
		cursor: pointer;
		border-radius: 3px;
	}

	.name:hover {
		background: #f5f7fa;
	}

	.unnamed .name {
		font-weight: 400;
		font-size: 0.8rem;
		color: #aaa;
	}

	.name-input {
		font-size: 1rem;
		font-weight: 700;
		padding: 0.1rem 0.3rem;
		border: 1px solid #7aa7d9;
		border-radius: 3px;
	}

	.collapse,
	.section-action,
	.add-bar {
		border: none;
		background: transparent;
		color: #bbb;
		cursor: pointer;
	}

	.collapse {
		width: 1.25rem;
		padding: 0.1rem 0;
		font-size: 0.8rem;
		color: #888;
	}

	.collapse:hover,
	.section-action:hover {
		color: #1a4d8f;
	}

	.summary {
		font-size: 0.8rem;
		color: #888;
	}

	.section-action {
		font-size: 1rem;
		line-height: 1;
		padding: 0.2rem 0.4rem;
		opacity: 0;
	}

	.section-header:hover .section-action,
	.section-action:focus-visible {
		opacity: 1;
	}

	.collapsed .section-body {
		display: none;
	}

	.delete-section:hover {
		color: #c0392b;
	}

	.add-bar {
		margin-left: 2.25rem;
		font-size: 0.8rem;
		padding: 0.1rem 0.2rem;
	}

	.add-bar:hover {
		color: #1a4d8f;
	}

	@media print {
		/* A printed leadsheet always shows every bar, even from minimised sections. */
		.collapsed .section-body {
			display: block;
		}

		.collapse,
		.summary,
		.section-action,
		.add-bar,
		.unnamed {
			display: none;
		}
	}
</style>
