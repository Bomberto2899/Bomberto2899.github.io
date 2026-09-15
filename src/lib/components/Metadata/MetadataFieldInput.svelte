<script lang="ts">
	import type { MetadataFieldDescriptor } from '../../metadata/fieldRegistry';

	let {
		field,
		value,
		onCommit
	}: { field: MetadataFieldDescriptor; value: string; onCommit: (raw: string) => void } = $props();

	let draft = $state(value);
	let error = $state<string | null>(null);

	$effect(() => {
		draft = value;
	});

	function commitText() {
		const validationError = field.validate?.(draft) ?? null;
		if (validationError) {
			error = validationError;
			return;
		}
		error = null;
		onCommit(draft);
	}

	function commitSelect(event: Event) {
		error = null;
		onCommit((event.target as HTMLSelectElement).value);
	}
</script>

<label class="field">
	<span class="label">{field.label}</span>
	{#if field.widget === 'select'}
		<select value={draft} onchange={commitSelect}>
			{#each field.options ?? [] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{:else}
		<input
			type="text"
			bind:value={draft}
			onblur={commitText}
			onkeydown={(e) => e.key === 'Enter' && commitText()}
		/>
	{/if}
	{#if error}
		<span class="error">{error}</span>
	{/if}
</label>

<style>
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

	input,
	select {
		font-size: 0.9rem;
		padding: 0.3rem 0.4rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.error {
		color: #c0392b;
		font-size: 0.75rem;
	}
</style>
