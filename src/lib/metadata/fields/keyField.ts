import type { MetadataFieldDescriptor } from '../fieldRegistry';

const KEY_PATTERN = /^[A-G](#|b)?m?$/;
const DEFAULT_KEY = 'C';

export const keyField: MetadataFieldDescriptor<string> = {
	id: 'key',
	label: 'Key',
	default: DEFAULT_KEY,
	widget: 'text',
	parse(raw) {
		return raw && KEY_PATTERN.test(raw) ? raw : DEFAULT_KEY;
	},
	serialize(value) {
		return value;
	},
	validate(raw) {
		return KEY_PATTERN.test(raw)
			? null
			: 'Expected a note name, optionally with # or b, and a trailing "m" for minor (e.g. "C", "F#", "Bbm")';
	}
};
