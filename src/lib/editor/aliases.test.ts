import { describe, expect, it } from 'vitest';
import { aliasExpansionEdit } from './aliases';

function expand(value: string, caret = value.length) {
	const edit = aliasExpansionEdit(value, caret);
	if (!edit) return null;
	const text = value.slice(0, edit.start) + edit.text + value.slice(edit.end);
	return { text, cursor: edit.cursor };
}

describe('aliasExpansionEdit', () => {
	it('expands \\keyword into an open/close tag pair', () => {
		expect(expand('\\lyric')).toEqual({ text: '<lyric></lyric>', cursor: '<lyric>'.length });
	});

	it('expands an alias in the middle of existing text', () => {
		const value = '<bar>\n\t\\chords\n</bar>';
		const caret = value.indexOf('\n</bar>');
		expect(expand(value, caret)).toEqual({
			text: '<bar>\n\t<chords></chords>\n</bar>',
			cursor: '<bar>\n\t<chords>'.length
		});
	});

	it('returns null when the caret is not right after an alias', () => {
		expect(aliasExpansionEdit('<bar>', 5)).toBeNull();
		expect(aliasExpansionEdit('\\lyric ', 7)).toBeNull();
		expect(aliasExpansionEdit('\\', 1)).toBeNull();
	});

	it('\\split ends the current lyric and starts a new one on an indented line', () => {
		const value = '\t\t<lyric>Lorem \\split ipsum</lyric>';
		const caret = value.indexOf(' ipsum');
		expect(expand(value, caret)).toEqual({
			text: '\t\t<lyric>Lorem </lyric>\n\t\t<lyric> ipsum</lyric>',
			cursor: '\t\t<lyric>Lorem </lyric>\n\t\t<lyric>'.length
		});
	});
});
