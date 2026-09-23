import type { Bar, Section, Song } from './types';
import { buildDefaultMetadata } from '../metadata/fieldRegistry';
import { createId } from '../utils/id';

export function createBlankSong(): Song {
	return {
		metadata: buildDefaultMetadata(),
		sections: []
	};
}

export function createBlankSection(name = ''): Section {
	return { id: createId(), name, bars: [] };
}

export function createBlankBar(): Bar {
	return { id: createId(), chords: [], lyrics: [] };
}

/** Deep-copies a section, giving it and everything in it fresh ids. */
export function cloneSection(section: Section): Section {
	return {
		id: createId(),
		name: section.name,
		bars: section.bars.map((bar) => ({
			id: createId(),
			chords: bar.chords.map((chord) => ({ ...chord, id: createId() })),
			lyrics: bar.lyrics.map((lyric) => ({ ...lyric, id: createId() }))
		}))
	};
}
