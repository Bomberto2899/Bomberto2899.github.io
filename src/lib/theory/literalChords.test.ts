import { describe, expect, it } from 'vitest';
import { chordSymbolToRoman } from './literalChords';
import { romanToChordSymbol } from './romanNumerals';

describe('chordSymbolToRoman', () => {
	it('C in C major is I', () => {
		expect(chordSymbolToRoman('C', 'C', 'flat')).toBe('I');
	});

	it('Am in C major is vi', () => {
		expect(chordSymbolToRoman('Am', 'C', 'flat')).toBe('vi');
	});

	it('F in C major is IV', () => {
		expect(chordSymbolToRoman('F', 'C', 'flat')).toBe('IV');
	});

	it('G7 in C major is V7', () => {
		expect(chordSymbolToRoman('G7', 'C', 'flat')).toBe('V7');
	});

	it('Fm in C major is iv', () => {
		expect(chordSymbolToRoman('Fm', 'C', 'flat')).toBe('iv');
	});

	it('Bb in C major is bVII', () => {
		expect(chordSymbolToRoman('Bb', 'C', 'flat')).toBe('bVII');
	});

	it('A# in C major is #VI under sharp preference (same pitch as Bb, spelled via the nearer sharp degree)', () => {
		expect(chordSymbolToRoman('A#', 'C', 'sharp')).toBe('#VI');
	});

	it('Bdim in C major is vii°', () => {
		expect(chordSymbolToRoman('Bdim', 'C', 'flat')).toBe('vii°');
	});

	it('Dm7b5 in C major is iiø', () => {
		expect(chordSymbolToRoman('Dm7b5', 'C', 'flat')).toBe('iiø');
	});

	it('Am in A minor is i', () => {
		expect(chordSymbolToRoman('Am', 'Am', 'flat')).toBe('i');
	});

	it('E in A minor is V (major dominant borrowed into minor)', () => {
		expect(chordSymbolToRoman('E', 'Am', 'flat')).toBe('V');
	});

	it('throws on unrecognized text', () => {
		expect(() => chordSymbolToRoman('not a chord', 'C', 'flat')).toThrow();
	});

	it('round-trips literal -> roman -> literal for common diatonic chords in C', () => {
		for (const chord of ['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bdim']) {
			const roman = chordSymbolToRoman(chord, 'C', 'flat');
			expect(romanToChordSymbol(roman, 'C', 'flat')).toBe(chord);
		}
	});
});
