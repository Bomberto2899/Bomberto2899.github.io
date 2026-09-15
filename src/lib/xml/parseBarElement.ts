import type { Bar, ChordEvent, LyricEvent } from '../model/types';
import { createId } from '../utils/id';
import { XmlParseError } from './xmlErrors';

function parseBeatAttribute(el: Element): number | undefined {
	const raw = el.getAttribute('beat');
	if (raw === null) return undefined;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) {
		throw new XmlParseError(`Invalid beat="${raw}" on <${el.tagName}>`);
	}
	return parsed;
}

function parseChordElement(el: Element): ChordEvent {
	return {
		id: createId(),
		text: el.textContent ?? '',
		beat: parseBeatAttribute(el),
		romanNumerals: el.getAttribute('romannumerals') === 'true'
	};
}

function parseLyricElement(el: Element): LyricEvent {
	return {
		id: createId(),
		text: el.textContent ?? '',
		beat: parseBeatAttribute(el)
	};
}

/** Parses a DOM <bar> element (shared by the full-file parser and the per-bar inline editor). */
export function parseBarElement(barEl: Element): Bar {
	if (barEl.tagName !== 'bar') {
		throw new XmlParseError(`Expected a <bar> element, got <${barEl.tagName}>`);
	}

	const chordsEl = barEl.getElementsByTagName('chords')[0];
	const lyricsEl = barEl.getElementsByTagName('lyrics')[0];

	const chords = chordsEl
		? Array.from(chordsEl.getElementsByTagName('chord')).map(parseChordElement)
		: [];
	const lyrics = lyricsEl
		? Array.from(lyricsEl.getElementsByTagName('lyric')).map(parseLyricElement)
		: [];

	return { id: createId(), chords, lyrics };
}
