<script lang="ts">
	import { tick } from 'svelte';
	import type { Bar, Metadata } from '../../model/types';
	import { serializeBar } from '../../xml/serializeBar';
	import { parseBarFragment } from '../../xml/parseBarFragment';
	import { songStore } from '../../state/songStore.svelte';
	import { applyEdit, indentEdit, outdentEdit } from '../../editor/textareaEditing';
	import { aliasExpansionEdit } from '../../editor/aliases';
	import BarRenderer from './BarRenderer.svelte';
	import ErrorBanner from '../Common/ErrorBanner.svelte';

	let { bar, barNumber, metadata }: { bar: Bar; barNumber: number; metadata: Metadata } = $props();

	let mode = $state<'view' | 'edit'>('view');
	let rawText = $state('');
	let errorMessage = $state<string | null>(null);
	let textareaEl = $state<HTMLTextAreaElement | undefined>(undefined);

	async function enterEditMode() {
		rawText = serializeBar(bar, '');
		errorMessage = null;
		mode = 'edit';
		await tick();
		textareaEl?.focus();
	}

	function commit() {
		try {
			const parsed = parseBarFragment(rawText);
			songStore.replaceBar(bar.id, parsed);
			errorMessage = null;
			mode = 'view';
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Could not parse this bar';
			// Blur isn't cancelable, so the only way to "reject" it is to steal focus back
			// once the browser finishes processing it.
			setTimeout(() => textareaEl?.focus(), 0);
		}
	}

	function cancel() {
		rawText = serializeBar(bar, '');
		errorMessage = null;
		mode = 'view';
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			cancel();
		} else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			commit();
		} else if (event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey) {
			// Keep focus in the editor; Escape and Ctrl/Cmd+Enter remain the ways out.
			event.preventDefault();
			onTab(event.shiftKey);
		}
	}

	function onTab(outdent: boolean) {
		if (!textareaEl) return;
		const { selectionStart, selectionEnd, value } = textareaEl;
		const alias =
			!outdent && selectionStart === selectionEnd ? aliasExpansionEdit(value, selectionStart) : null;
		const edit =
			alias ?? (outdent ? outdentEdit(value, selectionStart) : indentEdit(selectionStart, selectionEnd));
		if (edit) applyEdit(textareaEl, edit);
	}

	function deleteBar(event: MouseEvent) {
		event.stopPropagation();
		songStore.deleteBar(bar.id);
	}
</script>

<div class="bar-view">
	{#if mode === 'view'}
		<div
			class="bar-clickable"
			role="button"
			tabindex="0"
			onclick={enterEditMode}
			onkeydown={(e) => e.key === 'Enter' && enterEditMode()}
		>
			<BarRenderer {bar} {barNumber} {metadata} />
			<button class="delete-bar" onclick={deleteBar} title="Delete this bar">&times;</button>
		</div>
	{:else}
		<div class="bar-editor">
			<div class="bar-number">{barNumber}</div>
			<textarea
				bind:this={textareaEl}
				bind:value={rawText}
				onblur={commit}
				onkeydown={onKeydown}
				spellcheck="false"
			></textarea>
		</div>
		{#if errorMessage}
			<ErrorBanner message={errorMessage} />
		{/if}
	{/if}
</div>

<style>
	.bar-clickable {
		position: relative;
		cursor: pointer;
		border-radius: 4px;
	}

	.bar-clickable:hover {
		background: #f5f7fa;
	}

	.delete-bar {
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		background: transparent;
		color: #bbb;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
	}

	.delete-bar:hover {
		color: #c0392b;
	}

	.bar-editor {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
		padding: 0.5rem 0;
	}

	.bar-number {
		flex: 0 0 1.75rem;
		color: #888;
		font-size: 0.8rem;
		padding-top: 0.4rem;
		text-align: right;
	}

	textarea {
		flex: 1 1 auto;
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
		font-size: 0.85rem;
		min-height: 8rem;
		padding: 0.5rem;
		border: 1px solid #7aa7d9;
		border-radius: 4px;
		resize: vertical;
	}

	@media print {
		.delete-bar {
			display: none;
		}
	}
</style>
