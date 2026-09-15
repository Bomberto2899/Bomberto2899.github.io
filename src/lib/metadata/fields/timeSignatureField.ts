import type { MetadataFieldDescriptor } from '../fieldRegistry';

const TIME_SIGNATURE_PATTERN = /^\d+\/\d+$/;
const DEFAULT_TIME_SIGNATURE = '4/4';

export const timeSignatureField: MetadataFieldDescriptor<string> = {
	id: 'timesignature',
	label: 'Time signature',
	default: DEFAULT_TIME_SIGNATURE,
	widget: 'text',
	parse(raw) {
		return raw && TIME_SIGNATURE_PATTERN.test(raw) ? raw : DEFAULT_TIME_SIGNATURE;
	},
	serialize(value) {
		return value;
	},
	validate(raw) {
		return TIME_SIGNATURE_PATTERN.test(raw) ? null : 'Expected a format like "4/4" or "3/4"';
	}
};
