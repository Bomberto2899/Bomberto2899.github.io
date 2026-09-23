const FORM_GRAPH_KEY = 'leadsheet-tool:show-form-graph';
const SECTIONS_KEY = 'leadsheet-tool:show-sections';

function readStoredFlag(key: string, fallback: boolean): boolean {
	try {
		const stored = localStorage.getItem(key);
		return stored === null ? fallback : stored === 'true';
	} catch {
		return fallback;
	}
}

function storeFlag(key: string, value: boolean): void {
	try {
		localStorage.setItem(key, String(value));
	} catch {
		// A view preference; losing it is harmless.
	}
}

let showFormGraph = $state(readStoredFlag(FORM_GRAPH_KEY, false));
let showSections = $state(readStoredFlag(SECTIONS_KEY, true));

export const viewOptions = {
	get showFormGraph() {
		return showFormGraph;
	},
	setShowFormGraph(value: boolean) {
		showFormGraph = value;
		storeFlag(FORM_GRAPH_KEY, value);
	},
	/** When false, section headings and per-section controls are hidden and bars run on continuously. */
	get showSections() {
		return showSections;
	},
	setShowSections(value: boolean) {
		showSections = value;
		storeFlag(SECTIONS_KEY, value);
	}
};
