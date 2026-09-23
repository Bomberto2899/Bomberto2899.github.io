import { describe, expect, it } from 'vitest';
import { indentEdit, outdentEdit } from './textareaEditing';

describe('indentEdit', () => {
	it('replaces the selection with a tab and moves the caret past it', () => {
		expect(indentEdit(2, 5)).toEqual({ start: 2, end: 5, text: '\t', cursor: 3 });
	});
});

describe('outdentEdit', () => {
	it("removes one leading tab from the caret's line", () => {
		const value = '<bar>\n\t\t<chords>';
		expect(outdentEdit(value, value.length)).toEqual({
			start: 6,
			end: 7,
			text: '',
			cursor: value.length - 1
		});
	});

	it('returns null when the line has no leading tab', () => {
		expect(outdentEdit('<bar>\n<chords>', 10)).toBeNull();
	});
});
