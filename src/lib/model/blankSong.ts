import type { Bar, Song } from './types';
import { buildDefaultMetadata } from '../metadata/fieldRegistry';
import { createId } from '../utils/id';

export function createBlankSong(): Song {
	return {
		metadata: buildDefaultMetadata(),
		bars: []
	};
}

export function createBlankBar(): Bar {
	return { id: createId(), chords: [], lyrics: [] };
}
