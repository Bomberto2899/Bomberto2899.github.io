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
