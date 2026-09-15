export type Mode = 'major' | 'minor';

/** Semitone offsets from the tonic for each scale degree (1-indexed degrees 1..7). */
export const SCALE_TABLES: Record<Mode, number[]> = {
	major: [0, 2, 4, 5, 7, 9, 11],
	minor: [0, 2, 3, 5, 7, 8, 10] // natural minor
};
