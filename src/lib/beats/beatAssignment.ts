import type { PositionedItem } from '../model/types';

interface Beatable {
	beat?: number;
}

/**
 * Assigns 1-based (possibly fractional) beat positions to a document-ordered list of
 * chords or lyrics within a single bar.
 *
 * Items without an explicit `beat` are spread evenly across the beats NOT claimed by any
 * explicit-beat item, using a floor-based even distribution. Items that share the same
 * explicit beat are evenly subdivided within that single beat's width.
 */
export function assignBeatPositions<T extends Beatable>(
	items: T[],
	beatsPerBar: number
): PositionedItem<T>[] {
	const explicit: { item: T; beat: number; docIndex: number }[] = [];
	const unmarked: { item: T; docIndex: number }[] = [];

	items.forEach((item, docIndex) => {
		if (item.beat !== undefined) {
			const clamped = Math.min(Math.max(Math.round(item.beat), 1), beatsPerBar);
			if (clamped !== item.beat) {
				console.warn(
					`beat="${item.beat}" is out of range for a ${beatsPerBar}-beat bar; clamped to ${clamped}`
				);
			}
			explicit.push({ item, beat: clamped, docIndex });
		} else {
			unmarked.push({ item, docIndex });
		}
	});

	const result: PositionedItem<T>[] = [];

	const groups = new Map<number, { item: T; docIndex: number }[]>();
	for (const { item, beat, docIndex } of explicit) {
		const group = groups.get(beat) ?? [];
		group.push({ item, docIndex });
		groups.set(beat, group);
	}
	for (const [beat, group] of groups) {
		group.sort((a, b) => a.docIndex - b.docIndex);
		const k = group.length;
		group.forEach(({ item }, j) => {
			result.push({ item, position: beat + j / k });
		});
	}

	const claimedBeats = new Set(groups.keys());
	const fullRange = Array.from({ length: beatsPerBar }, (_, i) => i + 1);
	let slotList = fullRange.filter((b) => !claimedBeats.has(b));
	const n = unmarked.length;

	if (n > 0) {
		if (slotList.length === 0) {
			console.warn(
				'All beats in this bar are claimed by explicit beat= items, but unmarked items remain; falling back to spreading them across the full bar.'
			);
			slotList = fullRange;
		}
		const m = slotList.length;
		unmarked
			.slice()
			.sort((a, b) => a.docIndex - b.docIndex)
			.forEach(({ item }, i) => {
				const position = slotList[Math.floor((i * m) / n)];
				result.push({ item, position });
			});
	}

	return result.sort((a, b) => a.position - b.position);
}
