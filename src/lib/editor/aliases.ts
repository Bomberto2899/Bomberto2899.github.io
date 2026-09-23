import type { TextEdit } from './textareaEditing';

const ALIAS_BEFORE_CARET = /\\([A-Za-z][\w-]*)$/;

/**
 * If the caret sits right after `\keyword`, returns the edit that expands it to
 * `<keyword></keyword>` with the caret between the tags; otherwise null.
 */
export function aliasExpansionEdit(value: string, caret: number): TextEdit | null {
	const match = ALIAS_BEFORE_CARET.exec(value.slice(0, caret));
	if (!match) return null;
	const keyword = match[1];
	const openTag = `<${keyword}>`;
	return {
		start: match.index,
		end: caret,
		text: `${openTag}</${keyword}>`,
		cursor: match.index + openTag.length
	};
}
