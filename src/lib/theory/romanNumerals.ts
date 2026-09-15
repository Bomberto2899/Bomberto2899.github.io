import { spellNote, type Accidental } from './pitchClasses';
import { parseKey } from './keyParsing';
import { SCALE_TABLES } from './scales';

// Longest tokens first so e.g. "III" isn't matched as "I" followed by leftover "II".
const ROMAN_NUMERAL_PATTERN =
	/^(b|#)?(vii|VII|iii|III|vi|VI|iv|IV|ii|II|v|V|i|I)(°|ø|\+)?(.*)$/;

const DEGREE_BY_CORE: Record<string, number> = {
	i: 1,
	ii: 2,
	iii: 3,
	iv: 4,
	v: 5,
	vi: 6,
	vii: 7
};

export interface ParsedRomanNumeral {
	accidental: 'b' | '#' | null;
	core: string;
	isLowercase: boolean;
	degree: number;
	quality: '°' | 'ø' | '+' | null;
	extension: string;
}

export function parseRomanNumeral(text: string): ParsedRomanNumeral {
	const trimmed = text.trim();
	const match = ROMAN_NUMERAL_PATTERN.exec(trimmed);
	if (!match) {
		throw new Error(`"${text}" is not a recognizable roman numeral chord`);
	}
	const [, accidental, core, quality, extension] = match;
	const isLowercase = core === core.toLowerCase();
	return {
		accidental: (accidental as 'b' | '#' | null) ?? null,
		core,
		isLowercase,
		degree: DEGREE_BY_CORE[core.toLowerCase()],
		quality: (quality as '°' | 'ø' | '+' | null) ?? null,
		extension: extension ?? ''
	};
}

/** Converts a roman-numeral chord (e.g. "V7", "iv", "bVII", "vii°") to a literal chord symbol given a key. */
export function romanToChordSymbol(text: string, key: string, accidentalPref: Accidental): string {
	const parsed = parseRomanNumeral(text);
	const { tonicSemitone, mode } = parseKey(key);

	const degreeSemitone = SCALE_TABLES[mode][parsed.degree - 1];
	const accidentalOffset = parsed.accidental === 'b' ? -1 : parsed.accidental === '#' ? 1 : 0;
	const rootSemitone = ((tonicSemitone + degreeSemitone + accidentalOffset) % 12 + 12) % 12;
	const rootName = spellNote(rootSemitone, accidentalPref);

	let qualitySuffix: string;
	switch (parsed.quality) {
		case '°':
			qualitySuffix = 'dim' + parsed.extension;
			break;
		case 'ø':
			qualitySuffix = 'm7b5';
			break;
		case '+':
			qualitySuffix = 'aug' + parsed.extension;
			break;
		default:
			qualitySuffix = (parsed.isLowercase ? 'm' : '') + parsed.extension;
	}

	return rootName + qualitySuffix;
}
