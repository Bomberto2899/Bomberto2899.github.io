import { noteNameToSemitone } from './pitchClasses';
import type { Mode } from './scales';

export interface KeyInfo {
	tonicSemitone: number;
	tonicName: string;
	mode: Mode;
}

/** Parses a key like "C", "Am", "F#m", "Bbm". Trailing "m" marks minor, same convention as chord symbols. */
export function parseKey(raw: string): KeyInfo {
	const trimmed = raw.trim();
	const isMinor = trimmed.length > 1 && trimmed.endsWith('m');
	const tonicName = isMinor ? trimmed.slice(0, -1) : trimmed;
	return {
		tonicSemitone: noteNameToSemitone(tonicName),
		tonicName,
		mode: isMinor ? 'minor' : 'major'
	};
}
