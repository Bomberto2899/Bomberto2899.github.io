import { describe, expect, it } from 'vitest';
import type { Section } from './types';
import { cloneSection } from './blankSong';

describe('cloneSection', () => {
	it('copies names, bars, chords and lyrics under fresh ids', () => {
		const original: Section = {
			id: 's1',
			name: 'Chorus',
			bars: [
				{
					id: 'b1',
					chords: [{ id: 'c1', text: 'C', beat: 2, romanNumerals: false }],
					lyrics: [{ id: 'l1', text: 'la la' }]
				}
			]
		};

		const copy = cloneSection(original);

		expect(copy.name).toBe('Chorus');
		expect(copy.bars[0].chords[0]).toMatchObject({ text: 'C', beat: 2, romanNumerals: false });
		expect(copy.bars[0].lyrics[0].text).toBe('la la');
		const ids = [copy.id, copy.bars[0].id, copy.bars[0].chords[0].id, copy.bars[0].lyrics[0].id];
		expect(ids).not.toContain('s1');
		expect(ids).not.toContain('b1');
		expect(ids).not.toContain('c1');
		expect(ids).not.toContain('l1');
		expect(new Set(ids).size).toBe(4);
	});
});
