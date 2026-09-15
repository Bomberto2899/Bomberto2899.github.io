import type { MetadataFieldDescriptor } from '../fieldRegistry';

export const nameField: MetadataFieldDescriptor<string> = {
	id: 'name',
	label: 'Title',
	default: '',
	widget: 'text',
	parse(raw) {
		return raw ?? '';
	},
	serialize(value) {
		return value;
	}
};
