import type { Bar } from '../model/types';
import { parseBarElement } from './parseBarElement';
import { findParserError, XmlParseError } from './xmlErrors';

/** Parses a single raw `<bar>...</bar>` fragment, as typed by a user in the inline editor. */
export function parseBarFragment(fragmentText: string): Bar {
	const wrapped = `<root>${fragmentText}</root>`;
	const doc = new DOMParser().parseFromString(wrapped, 'application/xml');

	const parserError = findParserError(doc);
	if (parserError) {
		throw new XmlParseError(parserError);
	}

	const barEl = doc.documentElement.getElementsByTagName('bar')[0];
	if (!barEl) {
		throw new XmlParseError('Expected a single <bar>...</bar> element');
	}

	return parseBarElement(barEl);
}
