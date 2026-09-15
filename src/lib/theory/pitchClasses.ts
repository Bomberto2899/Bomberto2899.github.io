export type Accidental = 'flat' | 'sharp';

const NOTE_TO_SEMITONE: Record<string, number> = {
	C: 0,
	'B#': 0,
	'C#': 1,
	Db: 1,
	D: 2,
	'D#': 3,
	Eb: 3,
	E: 4,
	Fb: 4,
	'E#': 5,
	F: 5,
	'F#': 6,
	Gb: 6,
	G: 7,
	'G#': 8,
	Ab: 8,
	A: 9,
	'A#': 10,
	Bb: 10,
	B: 11,
	Cb: 11
};

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function noteNameToSemitone(name: string): number {
	const semitone = NOTE_TO_SEMITONE[name];
	if (semitone === undefined) {
		throw new Error(`Unrecognized note name: "${name}"`);
	}
	return semitone;
}

export function spellNote(semitone: number, accidental: Accidental): string {
	const normalized = ((semitone % 12) + 12) % 12;
	return accidental === 'flat' ? FLAT_NAMES[normalized] : SHARP_NAMES[normalized];
}
