import type { Bar, PositionedBar } from '../model/types';
import { assignBeatPositions } from './beatAssignment';

export function positionBar(bar: Bar, beatsPerBar: number): PositionedBar {
	return {
		barId: bar.id,
		beatsPerBar,
		chords: assignBeatPositions(bar.chords, beatsPerBar),
		lyrics: assignBeatPositions(bar.lyrics, beatsPerBar)
	};
}
