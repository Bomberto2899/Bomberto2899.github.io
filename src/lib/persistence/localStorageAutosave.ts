import type { Song } from '../model/types';
import { parseSong } from '../xml/parseSong';
import { serializeSong } from '../xml/serializeSong';
import { debounce } from '../utils/debounce';

const STORAGE_KEY = 'leadsheet-tool:autosave';
const DEBOUNCE_MS = 500;

const save = debounce((song: Song) => {
	try {
		localStorage.setItem(STORAGE_KEY, serializeSong(song));
	} catch {
		// Best-effort: private browsing / storage-full failures shouldn't break the app.
	}
}, DEBOUNCE_MS);

export function autosave(song: Song): void {
	save(song);
}

export function restoreAutosaved(): Song | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? parseSong(raw) : null;
	} catch {
		return null;
	}
}
