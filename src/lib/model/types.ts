export interface Song {
	metadata: Metadata;
	bars: Bar[];
}

export interface Bar {
	id: string;
	chords: ChordEvent[];
	lyrics: LyricEvent[];
}

export interface ChordEvent {
	id: string;
	text: string;
	beat?: number;
	romanNumerals: boolean;
}

export interface LyricEvent {
	id: string;
	text: string;
	beat?: number;
}

/** Raw attribute strings keyed by field id. Typed interpretation happens via the metadata field registry. */
export type Metadata = Record<string, string>;

export interface PositionedItem<T> {
	item: T;
	position: number;
}

export interface PositionedBar {
	barId: string;
	beatsPerBar: number;
	chords: PositionedItem<ChordEvent>[];
	lyrics: PositionedItem<LyricEvent>[];
	/** Each lyric's words, spread evenly from its beat up to the next lyric (or the end of the bar). */
	lyricWords: PositionedWord[];
}

export interface PositionedWord {
	/** Unique within the bar, for keyed rendering. */
	id: string;
	text: string;
	position: number;
}
