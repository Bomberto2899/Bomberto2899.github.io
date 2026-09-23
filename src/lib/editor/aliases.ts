import type { TextEdit } from './textareaEditing';

const ALIAS_BEFORE_CARET = /\\([A-Za-z][\w-]*)$/;

interface SpecialAlias {
	/** Shown in the Help panel. */
	description: string;
	/**
	 * Receives the leading whitespace of the caret's line so new lines stay aligned, and
	 * returns the replacement text plus where the caret goes inside it.
	 */
	expand: (indent: string) => { text: string; caretOffset: number };
}

/** Aliases that expand to something other than a `<keyword></keyword>` tag pair. */
const SPECIAL_ALIASES: Record<string, SpecialAlias> = {
	split: {
		description: 'Inside a <lyric>: ends it at the cursor and starts a new <lyric> on the next line.',
		expand: (indent) => {
			const text = `</lyric>\n${indent}<lyric>`;
			return { text, caretOffset: text.length };
		}
	}
};

/** Every alias with a short description, for the Help panel. */
export const ALIAS_HELP: { alias: string; description: string }[] = [
	...Object.entries(SPECIAL_ALIASES).map(([keyword, { description }]) => ({
		alias: `\\${keyword}`,
		description
	})),
	{
		alias: '\\keyword',
		description:
			'Any other word becomes <keyword></keyword> with the cursor between the tags, e.g. \\chords, \\chord, \\lyrics, \\lyric.'
	}
];

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
		const { text, caretOffset } = special.expand(indent);
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
