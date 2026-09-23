export interface Song {
	metadata: Metadata;
	sections: Section[];
}

export interface Section {
	id: string;
	/** Empty for an unnamed section (e.g. bars written directly under <song>). */
	name: string;
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
}
