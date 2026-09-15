import type { Song } from '../model/types';
import { metadataFieldRegistry } from '../metadata/fieldRegistry';
import { parseBarElement } from './parseBarElement';
import { findParserError, XmlParseError } from './xmlErrors';

export function parseSong(xmlText: string): Song {
	const doc = new DOMParser().parseFromString(xmlText, 'application/xml');

	const parserError = findParserError(doc);
	if (parserError) {
		throw new XmlParseError(parserError);
	}

	const root = doc.documentElement;
	if (!root || root.tagName !== 'song') {
		throw new XmlParseError('Expected the document root element to be <song>');
	}

	const metadataEl = root.getElementsByTagName('metadata')[0];
	const metadata: Record<string, string> = {};
	for (const field of metadataFieldRegistry) {
		const raw = metadataEl?.getAttribute(field.id) ?? undefined;
		metadata[field.id] = field.serialize(field.parse(raw));
	}

	const bars = Array.from(root.getElementsByTagName('bar')).map(parseBarElement);

	return { metadata, bars };
}
