<script lang="ts">
	import type { ChordEvent, Metadata } from '../../model/types';
	import { getAccidentalPreference, getKey } from '../../metadata/fieldRegistry';
	import { romanToChordSymbol } from '../../theory/romanNumerals';
	import { chordSymbolToRoman } from '../../theory/literalChords';
	import { notationMode } from '../../state/notationMode.svelte';

	let { chord, metadata }: { chord: ChordEvent; metadata: Metadata } = $props();

	let displayText = $derived.by(() => {
		const key = getKey(metadata);
		const accidentalPref = getAccidentalPreference(metadata);
		const wantsRoman = notationMode.current === 'roman';

		if (chord.romanNumerals === wantsRoman) {
			// Already authored in the requested notation.
			return chord.text;
		}
		try {
			return wantsRoman
				? chordSymbolToRoman(chord.text, key, accidentalPref)
				: romanToChordSymbol(chord.text, key, accidentalPref);
		} catch {
			return chord.text;
		}
	});
</script>

<span class="chord" class:roman={notationMode.current === 'roman'}>
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
