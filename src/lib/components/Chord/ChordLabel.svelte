<script lang="ts">
	import type { ChordEvent, Metadata } from '../../model/types';
	import { getAccidentalPreference, getKey } from '../../metadata/fieldRegistry';
	import { romanToChordSymbol } from '../../theory/romanNumerals';
	import { notationMode } from '../../state/notationMode.svelte';

	let { chord, metadata }: { chord: ChordEvent; metadata: Metadata } = $props();

	let displayText = $derived.by(() => {
		if (!chord.romanNumerals || notationMode.current === 'roman') {
			return chord.text;
		}
		try {
			return romanToChordSymbol(chord.text, getKey(metadata), getAccidentalPreference(metadata));
		} catch {
			return chord.text;
		}
	});
</script>

<span class="chord" class:roman={chord.romanNumerals && notationMode.current === 'roman'}>
	{displayText}
</span>

<style>
	.chord {
		font-weight: 700;
		color: var(--chord-color, #1a4d8f);
	}

	.chord.roman {
		font-style: italic;
	}
</style>
