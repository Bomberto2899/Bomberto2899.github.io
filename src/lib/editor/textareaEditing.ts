/** A single replacement of `value.slice(start, end)` with `text`, leaving the caret at `cursor`. */
export interface TextEdit {
	start: number;
	end: number;
	text: string;
	cursor: number;
}

/** Replaces the selection (or inserts at the caret) with a tab character. */
export function indentEdit(selectionStart: number, selectionEnd: number): TextEdit {
	return { start: selectionStart, end: selectionEnd, text: '\t', cursor: selectionStart + 1 };
}

/** Removes one leading tab from the caret's line, or returns null if the line has none. */
export function outdentEdit(value: string, caret: number): TextEdit | null {
	const lineStart = value.lastIndexOf('\n', caret - 1) + 1;
	if (value[lineStart] !== '\t') return null;
	return { start: lineStart, end: lineStart + 1, text: '', cursor: Math.max(lineStart, caret - 1) };
}

/**
 * Applies an edit to a textarea through `execCommand` so it lands on the browser's undo stack,
 * falling back to `setRangeText` (plus a synthetic input event to keep `bind:value` in sync).
 */
export function applyEdit(el: HTMLTextAreaElement, edit: TextEdit): void {
	el.setSelectionRange(edit.start, edit.end);
	const applied =
		typeof document.execCommand === 'function' &&
		(edit.text
			? document.execCommand('insertText', false, edit.text)
			: document.execCommand('delete'));
	if (!applied) {
		el.setRangeText(edit.text, edit.start, edit.end, 'end');
		el.dispatchEvent(new Event('input', { bubbles: true }));
	}
	el.setSelectionRange(edit.cursor, edit.cursor);
}
