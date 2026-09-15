import type { Song } from '../model/types';
import { parseSong } from '../xml/parseSong';
import { serializeSong } from '../xml/serializeSong';
import { debounce } from '../utils/debounce';

const STORAGE_KEY = 'leadsheet-tool:autosave';
const DEBOUNCE_MS = 500;

function saveImmediately(song: Song): void {
	try {
		localStorage.setItem(STORAGE_KEY, serializeSong(song));
	} catch {
		// Best-effort: private browsing / storage-full failures shouldn't break the app.
	}
}

const debouncedSave = debounce(saveImmediately, DEBOUNCE_MS);

export function autosave(song: Song): void {
	debouncedSave(song);
}

/** Bypasses the debounce so the latest state is never lost to an in-flight timer, e.g. on page unload. */
export function autosaveNow(song: Song): void {
	saveImmediately(song);
}

export function restoreAutosaved(): Song | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? parseSong(raw) : null;
	} catch {
		return null;
	}
}
