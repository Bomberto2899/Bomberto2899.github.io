export class XmlParseError extends Error {}

/** DOMParser never throws on malformed XML — it embeds a <parsererror> element instead. */
export function findParserError(doc: Document): string | null {
	const errorEl = doc.getElementsByTagName('parsererror')[0];
	return errorEl ? errorEl.textContent?.trim() ?? 'Malformed XML' : null;
}
