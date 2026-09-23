import { describe, expect, it } from 'vitest';
import { assignBeatPositions } from './beatAssignment';

interface TestItem {
	text: string;
	beat?: number;
}

function byPosition<T>(results: { item: T; position: number }[]) {
	return results.slice().sort((a, b) => a.position - b.position);
}

describe('assignBeatPositions', () => {
	it('reproduces the leadsheet-example.xml worked example', () => {
		const chords: TestItem[] = [
			{ text: 'C' },
			{ text: 'Am' },
			{ text: 'F' },
			{ text: 'G7sus4', beat: 4 },
			{ text: 'G7', beat: 4 }
		];

		const result = byPosition(assignBeatPositions(chords, 4));

		expect(result.map((r) => [r.item.text, r.position])).toEqual([
			['C', 1],
			['Am', 2],
			['F', 3],
			['G7sus4', 4],
			['G7', 4.5]
		]);
	});

	it('spreads 2 unmarked chords onto beats 1 and 3 in a 4/4 bar', () => {
		const chords: TestItem[] = [{ text: 'C' }, { text: 'G' }];
		const result = byPosition(assignBeatPositions(chords, 4));
		expect(result.map((r) => r.position)).toEqual([1, 3]);
	});

	it('spreads 3 unmarked chords onto beats 1, 2, 3 in a 4/4 bar (rounds down)', () => {
		const chords: TestItem[] = [{ text: 'C' }, { text: 'F' }, { text: 'G' }];
		const result = byPosition(assignBeatPositions(chords, 4));
		expect(result.map((r) => r.position)).toEqual([1, 2, 3]);
	});

	it('spreads 4 unmarked chords onto every beat in a 4/4 bar', () => {
		const chords: TestItem[] = [{ text: 'C' }, { text: 'F' }, { text: 'G' }, { text: 'Am' }];
		const result = byPosition(assignBeatPositions(chords, 4));
		expect(result.map((r) => r.position)).toEqual([1, 2, 3, 4]);
	});

	it('never places unmarked items on a beat claimed by an explicit item', () => {
		const chords: TestItem[] = [{ text: 'C' }, { text: 'F' }, { text: 'G', beat: 2 }];
		const result = byPosition(assignBeatPositions(chords, 4));
		expect(result.map((r) => [r.item.text, r.position])).toEqual([
			['C', 1],
			['G', 2],
			['F', 3]
		]);
	});

	it('subdivides three items sharing one explicit beat evenly', () => {
		const chords: TestItem[] = [
			{ text: 'A', beat: 2 },
			{ text: 'B', beat: 2 },
			{ text: 'C', beat: 2 }
		];
		const result = byPosition(assignBeatPositions(chords, 4));
		expect(result.map((r) => r.position)).toEqual([2, 2 + 1 / 3, 2 + 2 / 3]);
	});

	it('works identically for lyrics (independent of chords)', () => {
		const lyrics: TestItem[] = [{ text: 'Lo' }, { text: 'rem' }, { text: 'ip', beat: 4 }, { text: 'sum', beat: 4 }];
		const result = byPosition(assignBeatPositions(lyrics, 4));
		expect(result.map((r) => [r.item.text, r.position])).toEqual([
			['Lo', 1],
			['rem', 2],
			['ip', 4],
			['sum', 4.5]
		]);
	});

	it('spreads more unmarked items than beats evenly over the bar instead of stacking them', () => {
		const items: TestItem[] = [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }];
		const result = byPosition(assignBeatPositions(items, 3));
		expect(result.map((r) => r.position)).toEqual([1, 1.75, 2.5, 3.25]);
	});
});
