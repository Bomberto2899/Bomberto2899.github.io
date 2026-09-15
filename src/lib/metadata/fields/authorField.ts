import type { MetadataFieldDescriptor } from '../fieldRegistry';

export const authorField: MetadataFieldDescriptor<string> = {
	id: 'author',
	label: 'Author',
	default: '',
	widget: 'text',
	parse(raw) {
		return raw ?? '';
	},
	serialize(value) {
		return value;
	}
};
