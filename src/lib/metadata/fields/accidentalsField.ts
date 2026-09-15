import type { MetadataFieldDescriptor } from '../fieldRegistry';

export const accidentalsField: MetadataFieldDescriptor<'flat' | 'sharp'> = {
	id: 'accidentals',
	label: 'Accidentals',
	default: 'flat',
	widget: 'select',
	options: [
		{ value: 'flat', label: 'Flats (♭)' },
		{ value: 'sharp', label: 'Sharps (♯)' }
	],
	parse(raw) {
		return raw === 'sharp' ? 'sharp' : 'flat';
	},
	serialize(value) {
		return value;
	}
};
