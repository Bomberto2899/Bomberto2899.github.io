import type { Bar, Song } from '../model/types';
import { createBlankBar, createBlankSong } from '../model/blankSong';

let song = $state<Song>(createBlankSong());

export const songStore = {
	get song() {
		return song;
	},
	load(newSong: Song) {
		song = newSong;
	},
	replaceBar(barId: string, newBar: Bar) {
		const index = song.bars.findIndex((b) => b.id === barId);
		if (index === -1) return;
		// Preserve the original id so keyed #each blocks don't remount the component mid-edit.
		song.bars[index] = { ...newBar, id: barId };
	},
	addBar() {
		song.bars.push(createBlankBar());
	},
	deleteBar(barId: string) {
		song.bars = song.bars.filter((b) => b.id !== barId);
	},
	updateMetadataField(fieldId: string, value: string) {
		song.metadata = { ...song.metadata, [fieldId]: value };
	}
};
