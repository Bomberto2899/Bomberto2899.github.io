<script lang="ts">
	import { songStore } from '../state/songStore.svelte';
	import { viewOptions } from '../state/viewOptions.svelte';
	import { createBlankSong } from '../model/blankSong';
	import { downloadSong } from '../persistence/download';
	import { parseUploadedFile } from '../persistence/upload';
	import ErrorBanner from './Common/ErrorBanner.svelte';

	let fileInput = $state<HTMLInputElement | undefined>(undefined);
	let uploadError = $state<string | null>(null);

	function triggerUpload() {
		fileInput?.click();
	}

	function addSection() {
		// A new section opens straight into renaming, which needs its heading visible.
		viewOptions.setShowSections(true);
		songStore.addSection(`Section ${songStore.song.sections.length + 1}`);
	}

	function clearSong() {
		if (confirm('Clear the current leadsheet? This removes all sections and bars and resets metadata to defaults.')) {
			songStore.load(createBlankSong());
			uploadError = null;
		}
	}

	async function onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		try {
			const song = await parseUploadedFile(file);
			songStore.load(song);
			uploadError = null;
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Could not parse this file';
		} finally {
			input.value = '';
		}
	}
</script>

<div class="toolbar">
	<div class="actions">
		<button onclick={addSection}>+ Add section</button>
		<button onclick={() => songStore.addBar()}>+ Add bar</button>
		<button onclick={triggerUpload}>Upload leadsheet…</button>
		<button onclick={() => downloadSong(songStore.song)}>Download leadsheet</button>
		<button class="danger" onclick={clearSong}>Clear</button>
		<input
			bind:this={fileInput}
			type="file"
			accept=".xml,text/xml,application/xml"
			hidden
			onchange={onFileSelected}
		/>
	</div>
	{#if uploadError}
		<ErrorBanner message={uploadError} />
	{/if}
</div>

<style>
	.toolbar {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #ddd;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	button {
		font-size: 0.85rem;
		padding: 0.4rem 0.7rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
	}

	button:hover {
		background: #eef2f7;
	}

	button.danger:hover {
		background: #fdeaea;
		border-color: #e2a1a1;
		color: #8a1f1f;
	}

	@media print {
		.toolbar {
			display: none;
		}
	}
</style>
