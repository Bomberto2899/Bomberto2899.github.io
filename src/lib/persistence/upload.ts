import type { Song } from '../model/types';
import { parseSong } from '../xml/parseSong';

/** Reads and parses an uploaded leadsheet file. Throws on failure; caller decides how to surface it. */
export async function parseUploadedFile(file: File): Promise<Song> {
	const text = await file.text();
	return parseSong(text);
}
