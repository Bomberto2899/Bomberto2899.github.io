import type { Song } from '../model/types';
import { serializeSong } from '../xml/serializeSong';

export function downloadSong(song: Song, filename = 'leadsheet.xml'): void {
	const xml = serializeSong(song);
	const blob = new Blob([xml], { type: 'application/xml' });
	const url = URL.createObjectURL(blob);

	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();

	URL.revokeObjectURL(url);
}
