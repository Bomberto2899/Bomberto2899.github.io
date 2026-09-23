import type { TextEdit } from './textareaEditing';

const ALIAS_BEFORE_CARET = /\\([A-Za-z][\w-]*)$/;

/**
 * Aliases that expand to something other than a tag pair. Each receives the leading
 * whitespace of the caret's line so it can keep new lines aligned, and returns the
 * replacement text plus where the caret goes inside it.
 */
const SPECIAL_ALIASES: Record<string, (indent: string) => { text: string; caretOffset: number }> = {
	// Ends the current <lyric> and starts a new one on the next line.
	split: (indent) => {
		const text = `</lyric>\n${indent}<lyric>`;
		return { text, caretOffset: text.length };
	}
};

/**
 * If the caret sits right after `\keyword`, returns the edit that expands it — to
 * `<keyword></keyword>` with the caret between the tags, or to a special alias such as
 * `\split` — otherwise null.
 */
export function aliasExpansionEdit(value: string, caret: number): TextEdit | null {
	const beforeCaret = value.slice(0, caret);
	const match = ALIAS_BEFORE_CARET.exec(beforeCaret);
	if (!match) return null;
	const keyword = match[1];

	const special = SPECIAL_ALIASES[keyword];
	if (special) {
		const lineStart = beforeCaret.lastIndexOf('\n') + 1;
		const indent = /^[ \t]*/.exec(beforeCaret.slice(lineStart))![0];
		const { text, caretOffset } = special(indent);
		return { start: match.index, end: caret, text, cursor: match.index + caretOffset };
	}

	const openTag = `<${keyword}>`;
	return {
		start: match.index,
		end: caret,
		text: `${openTag}</${keyword}>`,
		cursor: match.index + openTag.length
	};
}
