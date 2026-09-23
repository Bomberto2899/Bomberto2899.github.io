const FORM_GRAPH_KEY = 'leadsheet-tool:show-form-graph';

function readStoredFlag(key: string): boolean {
	try {
		return localStorage.getItem(key) === 'true';
	} catch {
		return false;
	}
}

let showFormGraph = $state(readStoredFlag(FORM_GRAPH_KEY));

export const viewOptions = {
	get showFormGraph() {
		return showFormGraph;
	},
	setShowFormGraph(value: boolean) {
		showFormGraph = value;
		try {
			localStorage.setItem(FORM_GRAPH_KEY, String(value));
		} catch {
			// A view preference; losing it is harmless.
		}
	}
};
