import type { Section, Song } from '../model/types';
import { createBlankSection } from '../model/blankSong';
import { metadataFieldRegistry } from '../metadata/fieldRegistry';
import { parseBarElement } from './parseBarElement';
import { findParserError, XmlParseError } from './xmlErrors';

/**
 * Reads the direct children of <song>: each <section> becomes a Section, and runs of <bar>s
 * written directly under <song> are grouped into unnamed sections.
 */
function parseSections(root: Element): Section[] {
	const sections: Section[] = [];
	let looseSection: Section | null = null;

	for (const child of Array.from(root.children)) {
		if (child.tagName === 'section') {
			looseSection = null;
			const section = createBlankSection(child.getAttribute('name') ?? '');
			section.bars = Array.from(child.children)
				.filter((el) => el.tagName === 'bar')
				.map(parseBarElement);
			sections.push(section);
		} else if (child.tagName === 'bar') {
			if (!looseSection) {
				looseSection = createBlankSection();
				sections.push(looseSection);
			}
			looseSection.bars.push(parseBarElement(child));
		}
	}

	return sections;
}

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

	return { metadata, sections: parseSections(root) };
}
