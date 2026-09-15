export type NotationMode = 'roman' | 'literal';

let mode = $state<NotationMode>('literal');

export const notationMode = {
	get current() {
		return mode;
	},
	set(value: NotationMode) {
		mode = value;
	},
	toggle() {
		mode = mode === 'literal' ? 'roman' : 'literal';
	}
};
