import type { Bar, ChordEvent, LyricEvent } from '../model/types';
import { escapeXmlText } from './escapeXml';

function chordAttributes(chord: ChordEvent): string {
	let attrs = '';
	if (chord.beat !== undefined) attrs += ` beat="${chord.beat}"`;
	if (chord.romanNumerals) attrs += ` romannumerals="true"`;
	return attrs;
}

function lyricAttributes(lyric: LyricEvent): string {
	return lyric.beat !== undefined ? ` beat="${lyric.beat}"` : '';
}

/** Serializes a Bar to a raw, indented `<bar>...</bar>` XML fragment (used for download and the inline editor). */
export function serializeBar(bar: Bar, indent = '\t'): string {
	const lines: string[] = [`${indent}<bar>`];

	if (bar.chords.length > 0) {
		lines.push(`${indent}\t<chords>`);
		for (const chord of bar.chords) {
			lines.push(
				`${indent}\t\t<chord${chordAttributes(chord)}>${escapeXmlText(chord.text)}</chord>`
			);
		}
		lines.push(`${indent}\t</chords>`);
	}

	if (bar.lyrics.length > 0) {
		lines.push(`${indent}\t<lyrics>`);
		for (const lyric of bar.lyrics) {
			lines.push(
				`${indent}\t\t<lyric${lyricAttributes(lyric)}>${escapeXmlText(lyric.text)}</lyric>`
			);
		}
		lines.push(`${indent}\t</lyrics>`);
	}

	lines.push(`${indent}</bar>`);
	return lines.join('\n');
}
