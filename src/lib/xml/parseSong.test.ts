import { describe, expect, it } from 'vitest';
import { parseSong } from './parseSong';
import { serializeSong } from './serializeSong';
import { parseBarFragment } from './parseBarFragment';
import { XmlParseError } from './xmlErrors';

const EXAMPLE_XML = `<song>
	<bar>
		<chords>
			<chord>C</chord>
			<chord>Am</chord>
			<chord>F</chord>
			<chord beat="4">G7sus4</chord>
			<chord beat="4">G7</chord>
		</chords>
		<lyrics>
			<lyric> Lorem ipsum</lyric>
			<lyric> dolor sit amet </lyric>
		</lyrics>
	</bar>
	<bar>
		<chords>
			<chord>C</chord>
			<chord>Am</chord>
			<chord>F</chord>
			<chord beat="4">G7sus4</chord>
			<chord beat="4">G7</chord>
		</chords>
		<lyrics>
			<lyric> Lorem ipsum</lyric>
			<lyric> dolor sit amet </lyric>
		</lyrics>
	</bar>
</song>
`;

describe('parseSong', () => {
	it('parses the example leadsheet into a Song with default metadata', () => {
		const song = parseSong(EXAMPLE_XML);
		expect(song.bars).toHaveLength(2);
		expect(song.metadata.timesignature).toBe('4/4');
		expect(song.metadata.key).toBe('C');
		expect(song.metadata.accidentals).toBe('flat');

		const [bar1] = song.bars;
		expect(bar1.chords.map((c) => [c.text, c.beat])).toEqual([
			['C', undefined],
			['Am', undefined],
			['F', undefined],
			['G7sus4', 4],
			['G7', 4]
		]);
		expect(bar1.lyrics.map((l) => l.text)).toEqual([' Lorem ipsum', ' dolor sit amet ']);
	});

	it('reads explicit metadata attributes', () => {
		const song = parseSong(
			'<song><metadata timesignature="3/4" key="Am" accidentals="sharp" /></song>'
		);
		expect(song.metadata).toEqual({ timesignature: '3/4', key: 'Am', accidentals: 'sharp' });
	});

	it('parses the romannumerals flag on a chord', () => {
		const song = parseSong(
			'<song><bar><chords><chord romannumerals="true">V7</chord></chords></bar></song>'
		);
		expect(song.bars[0].chords[0].romanNumerals).toBe(true);
	});

	it('throws XmlParseError on malformed XML', () => {
		expect(() => parseSong('<song><bar></song>')).toThrow(XmlParseError);
	});

	it('throws XmlParseError when the root element is not <song>', () => {
		expect(() => parseSong('<notasong></notasong>')).toThrow(XmlParseError);
	});

	it('round-trips parse -> serialize -> parse without losing data', () => {
		const song = parseSong(EXAMPLE_XML);
		const reparsed = parseSong(serializeSong(song));
		expect(reparsed.metadata).toEqual(song.metadata);
		expect(reparsed.bars.map((b) => b.chords.map((c) => [c.text, c.beat]))).toEqual(
			song.bars.map((b) => b.chords.map((c) => [c.text, c.beat]))
		);
	});
});

describe('parseBarFragment', () => {
	it('parses a single raw bar fragment', () => {
		const bar = parseBarFragment('<bar><chords><chord>C</chord></chords></bar>');
		expect(bar.chords.map((c) => c.text)).toEqual(['C']);
	});

	it('throws XmlParseError on malformed fragment text', () => {
		expect(() => parseBarFragment('<bar><chords>')).toThrow(XmlParseError);
	});
});
