import type { Bar, Section, Song } from '../model/types';
import { createBlankBar, createBlankSection, createBlankSong } from '../model/blankSong';

let song = $state<Song>(createBlankSong());
/** Set when a section is added from the UI so its view can open straight into renaming. */
let sectionAwaitingRename = $state<string | null>(null);

function findBar(barId: string): { section: Section; index: number } | null {
	for (const section of song.sections) {
		const index = section.bars.findIndex((b) => b.id === barId);
		if (index !== -1) return { section, index };
	}
	return null;
}

export function countBars(s: Song): number {
	return s.sections.reduce((total, section) => total + section.bars.length, 0);
}

export const songStore = {
	get song() {
		return song;
	},
	get sectionAwaitingRename() {
		return sectionAwaitingRename;
	},
	load(newSong: Song) {
		song = newSong;
	},
	replaceBar(barId: string, newBar: Bar) {
		const found = findBar(barId);
		if (!found) return;
		// Preserve the original id so keyed #each blocks don't remount the component mid-edit.
		found.section.bars[found.index] = { ...newBar, id: barId };
	},
	/** Appends a bar to the given section, or to the last section (creating one if there are none). */
	addBar(sectionId?: string) {
		let section = sectionId
			? song.sections.find((s) => s.id === sectionId)
			: song.sections[song.sections.length - 1];
		if (!section) {
			if (sectionId) return;
			song.sections.push(createBlankSection());
			section = song.sections[song.sections.length - 1];
		}
		section.bars.push(createBlankBar());
	},
	deleteBar(barId: string) {
		const found = findBar(barId);
		if (!found) return;
		found.section.bars.splice(found.index, 1);
	},
	addSection(name: string) {
		const section = createBlankSection(name);
		section.bars.push(createBlankBar());
		song.sections.push(section);
		sectionAwaitingRename = section.id;
	},
	clearSectionAwaitingRename() {
		sectionAwaitingRename = null;
	},
	renameSection(sectionId: string, name: string) {
		const section = song.sections.find((s) => s.id === sectionId);
		if (section) section.name = name;
	},
	deleteSection(sectionId: string) {
		song.sections = song.sections.filter((s) => s.id !== sectionId);
	},
	updateMetadataField(fieldId: string, value: string) {
		song.metadata = { ...song.metadata, [fieldId]: value };
	}
};
