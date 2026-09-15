import { noteNameToSemitone, type Accidental } from './pitchClasses';
import { parseKey } from './keyParsing';
import { SCALE_TABLES } from './scales';

const CHORD_SYMBOL_PATTERN = /^([A-G])(#|b)?(.*)$/;

const ROMAN_CORE_BY_DEGREE = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export type ChordQuality = 'major' | 'minor' | 'dim' | 'aug' | 'half-dim';

export interface ParsedChordSymbol {
	rootName: string;
	rootSemitone: number;
	quality: ChordQuality;
	extension: string;
}

/** Parses a literal chord symbol (e.g. "C", "Am", "G7sus4", "Bdim7", "F#m7b5") into root + quality + extension. */
export function parseChordSymbol(text: string): ParsedChordSymbol {
	const trimmed = text.trim();
	const match = CHORD_SYMBOL_PATTERN.exec(trimmed);
	if (!match) {
		throw new Error(`"${text}" is not a recognizable chord symbol`);
	}
	const [, letter, accidental, suffix] = match;
	const rootName = letter + (accidental ?? '');
	const rootSemitone = noteNameToSemitone(rootName);

	let quality: ChordQuality;
	let extension: string;
	if (suffix.startsWith('dim')) {
		quality = 'dim';
		extension = suffix.slice(3);
	} else if (suffix === 'm7b5') {
		quality = 'half-dim';
		extension = '';
	} else if (suffix.startsWith('aug')) {
		quality = 'aug';
		extension = suffix.slice(3);
	} else if (suffix.startsWith('m') && !suffix.startsWith('maj')) {
		quality = 'minor';
		extension = suffix.slice(1);
	} else {
		quality = 'major';
		extension = suffix;
	}

	return { rootName, rootSemitone, quality, extension };
}

/**
 * Finds the diatonic scale degree (1-7) closest to a chromatic interval-from-tonic,
 * plus the accidental needed to reach it exactly (if any).
 */
function degreeForInterval(
	interval: number,
	scaleDegrees: number[],
	accidentalPref: Accidental
): { degree: number; accidental: 'b' | '#' | null } {
	const candidates: { degree: number; accidental: 'b' | '#' | null }[] = [];

	scaleDegrees.forEach((degreeSemitone, i) => {
		const raw = ((interval - degreeSemitone) % 12 + 12) % 12;
		if (raw === 0) candidates.push({ degree: i + 1, accidental: null });
		else if (raw === 1) candidates.push({ degree: i + 1, accidental: '#' });
		else if (raw === 11) candidates.push({ degree: i + 1, accidental: 'b' });
	});

	const exact = candidates.find((c) => c.accidental === null);
	if (exact) return exact;

	const preferred = candidates.find((c) => c.accidental === (accidentalPref === 'flat' ? 'b' : '#'));
	return preferred ?? candidates[0];
}

/** Converts a literal chord symbol (e.g. "G7", "Fm", "Bb") to a roman numeral given a key. */
export function chordSymbolToRoman(text: string, key: string, accidentalPref: Accidental): string {
	const chord = parseChordSymbol(text);
	const { tonicSemitone, mode } = parseKey(key);

	const interval = ((chord.rootSemitone - tonicSemitone) % 12 + 12) % 12;
	const { degree, accidental } = degreeForInterval(interval, SCALE_TABLES[mode], accidentalPref);

	const isLowercaseQuality = chord.quality === 'minor' || chord.quality === 'dim' || chord.quality === 'half-dim';
	const core = isLowercaseQuality
		? ROMAN_CORE_BY_DEGREE[degree - 1].toLowerCase()
		: ROMAN_CORE_BY_DEGREE[degree - 1];

	let qualitySuffix: string;
	switch (chord.quality) {
		case 'dim':
			qualitySuffix = '°' + chord.extension;
			break;
		case 'half-dim':
			qualitySuffix = 'ø';
			break;
		case 'aug':
			qualitySuffix = '+' + chord.extension;
			break;
		default:
			qualitySuffix = chord.extension;
	}

	return (accidental ?? '') + core + qualitySuffix;
}
