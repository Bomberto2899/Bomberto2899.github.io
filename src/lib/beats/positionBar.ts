import type { Bar, LyricEvent, PositionedBar, PositionedItem, PositionedWord } from '../model/types';
import { assignBeatPositions } from './beatAssignment';

/**
 * Gives each lyric the span from its own position up to the next lyric's (or the end of the bar)
 * and spreads its whitespace-separated words evenly across it, first word on the lyric's beat.
 */
function spreadLyricWords(
	lyrics: PositionedItem<LyricEvent>[],
	beatsPerBar: number
): PositionedWord[] {
	const barEnd = beatsPerBar + 1;
	return lyrics.flatMap(({ item, position }, i) => {
		const words = item.text.trim().split(/\s+/).filter(Boolean);
		const end = lyrics.slice(i + 1).find((next) => next.position > position)?.position ?? barEnd;
		const step = (end - position) / Math.max(words.length, 1);
		return words.map((text, j) => ({ id: `${item.id}:${j}`, text, position: position + j * step }));
	});
}

export function positionBar(bar: Bar, beatsPerBar: number): PositionedBar {
	const lyrics = assignBeatPositions(bar.lyrics, beatsPerBar);
	return {
		barId: bar.id,
		beatsPerBar,
		chords: assignBeatPositions(bar.chords, beatsPerBar),
		lyrics,
		lyricWords: spreadLyricWords(lyrics, beatsPerBar)
	};
}
