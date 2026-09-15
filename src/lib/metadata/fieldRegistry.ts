import type { Metadata } from '../model/types';

export interface MetadataFieldOption<T> {
	value: T;
	label: string;
}

export interface MetadataFieldDescriptor<T = string> {
	/** Also the XML attribute name on <metadata>. */
	id: string;
	label: string;
	default: T;
	widget: 'text' | 'select';
	options?: MetadataFieldOption<T>[];
	parse(raw: string | undefined): T;
	serialize(value: T): string;
	/** Returns an error message, or null if the raw input is valid. */
	validate?(raw: string): string | null;
}

// Registered in required file order: adding a field elsewhere in the app only requires
// creating its descriptor file and pushing it here.
import { nameField } from './fields/nameField';
import { authorField } from './fields/authorField';
import { timeSignatureField } from './fields/timeSignatureField';
import { keyField } from './fields/keyField';
import { accidentalsField } from './fields/accidentalsField';

export const metadataFieldRegistry: MetadataFieldDescriptor<any>[] = [
	nameField,
	authorField,
	timeSignatureField,
	keyField,
	accidentalsField
];

export function getField(id: string): MetadataFieldDescriptor<any> {
	const field = metadataFieldRegistry.find((f) => f.id === id);
	if (!field) throw new Error(`Unknown metadata field "${id}"`);
	return field;
}

export function getTypedValue<T>(metadata: Metadata, id: string): T {
	return getField(id).parse(metadata[id]) as T;
}

export function buildDefaultMetadata(): Metadata {
	return Object.fromEntries(
		metadataFieldRegistry.map((field) => [field.id, field.serialize(field.default)])
	);
}

export function getBeatsPerBar(metadata: Metadata): number {
	const timeSignature = getTypedValue<string>(metadata, 'timesignature');
	const [beats] = timeSignature.split('/');
	return Number(beats);
}

export function getKey(metadata: Metadata): string {
	return getTypedValue<string>(metadata, 'key');
}

export function getAccidentalPreference(metadata: Metadata): 'flat' | 'sharp' {
	return getTypedValue<'flat' | 'sharp'>(metadata, 'accidentals');
}

export function getSongName(metadata: Metadata): string {
	return getTypedValue<string>(metadata, 'name');
}

export function getSongAuthor(metadata: Metadata): string {
	return getTypedValue<string>(metadata, 'author');
}
