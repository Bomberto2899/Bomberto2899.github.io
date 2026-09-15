import { describe, expect, it } from 'vitest';
import { romanToChordSymbol } from './romanNumerals';

describe('romanToChordSymbol', () => {
	it('V7 in C major is G7', () => {
		expect(romanToChordSymbol('V7', 'C', 'flat')).toBe('G7');
	});

	it('iv in C major is Fm', () => {
		expect(romanToChordSymbol('iv', 'C', 'flat')).toBe('Fm');
	});

	it('bVII in C major is Bb (flat spelling)', () => {
		expect(romanToChordSymbol('bVII', 'C', 'flat')).toBe('Bb');
	});

	it('bVII in C major is A# under sharp spelling preference', () => {
		expect(romanToChordSymbol('bVII', 'C', 'sharp')).toBe('A#');
	});

	it('vii° in C major is Bdim', () => {
		expect(romanToChordSymbol('vii°', 'C', 'flat')).toBe('Bdim');
	});

	it('i in A minor is Am', () => {
		expect(romanToChordSymbol('i', 'Am', 'flat')).toBe('Am');
	});

	it('V in A minor is E (major dominant, uppercase core)', () => {
		expect(romanToChordSymbol('V', 'Am', 'flat')).toBe('E');
	});

	it('IV in G major is C', () => {
		expect(romanToChordSymbol('IV', 'G', 'flat')).toBe('C');
	});

	it('throws on unrecognized text', () => {
		expect(() => romanToChordSymbol('Xyz', 'C', 'flat')).toThrow();
	});
});
