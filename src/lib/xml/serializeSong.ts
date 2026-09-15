import type { Song } from '../model/types';
import { metadataFieldRegistry } from '../metadata/fieldRegistry';
import { escapeXmlAttribute } from './escapeXml';
import { serializeBar } from './serializeBar';

function serializeMetadata(song: Song): string | null {
	const attrs = metadataFieldRegistry
		.map((field) => {
			const value = song.metadata[field.id];
			return value ? `${field.id}="${escapeXmlAttribute(value)}"` : null;
		})
		.filter((attr): attr is string => attr !== null);

	return attrs.length > 0 ? `\t<metadata ${attrs.join(' ')} />` : null;
}

/** Serializes a Song back to well-formed, indented XML. */
export function serializeSong(song: Song): string {
	const lines: string[] = ['<song>'];

	const metadataLine = serializeMetadata(song);
	if (metadataLine) lines.push(metadataLine);

	for (const bar of song.bars) {
		lines.push(serializeBar(bar, '\t'));
	}

	lines.push('</song>');
	return lines.join('\n') + '\n';
}
