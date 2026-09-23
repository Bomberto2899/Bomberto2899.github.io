import { describe, expect, it } from 'vitest';
import type { Bar } from '../model/types';
import { positionBar } from './positionBar';

function barWithLyrics(...texts: (string | { text: string; beat: number })[]): Bar {
	return {
		id: 'bar',
		chords: [],
		lyrics: texts.map((t, i) =>
			typeof t === 'string' ? { id: `l${i}`, text: t } : { id: `l${i}`, ...t }
		)
	};
}

function words(bar: Bar, beatsPerBar: number) {
	return positionBar(bar, beatsPerBar).lyricWords.map((w) => [w.text, w.position]);
}

describe('positionBar lyric words', () => {
	it('spreads a single lyric across the whole 4/4 bar', () => {
		expect(words(barWithLyrics(' dolor sit amet sed '), 4)).toEqual([
			['dolor', 1],
			['sit', 2],
			['amet', 3],
			['sed', 4]
		]);
	});

	it('gives the second of two lyrics beats 3-4 as its domain', () => {
		expect(words(barWithLyrics(' Lorem ipsum', ' dolor sit amet '), 4)).toEqual([
			['Lorem', 1],
			['ipsum', 2],
			['dolor', 3],
			['sit', 3 + 2 / 3],
			['amet', 3 + 4 / 3]
		]);
	});

	it('starts each of four lyrics on its own beat in 4/4', () => {
		const result = words(barWithLyrics('a b', 'c', 'd', 'e'), 4);
		expect(result).toEqual([
			['a', 1],
			['b', 1.5],
			['c', 2],
			['d', 3],
			['e', 4]
		]);
	});

	it('spreads four lyrics evenly over a 3/4 bar', () => {
		expect(words(barWithLyrics('a', 'b', 'c', 'd'), 3)).toEqual([
			['a', 1],
			['b', 1.75],
			['c', 2.5],
			['d', 3.25]
		]);
	});

	it('respects explicit beats when computing domains', () => {
		expect(words(barWithLyrics({ text: 'x y', beat: 2 }), 4)).toEqual([
			['x', 2],
			['y', 3.5]
		]);
	});

	it('produces no words for an empty lyric', () => {
		expect(words(barWithLyrics('   '), 4)).toEqual([]);
	});
});
