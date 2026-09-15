<script lang="ts">
	import exampleXml from '../leadsheet-example.xml?raw';
	import { songStore } from './lib/state/songStore.svelte';
	import { parseSong } from './lib/xml/parseSong';
	import { autosave, restoreAutosaved } from './lib/persistence/localStorageAutosave';
	import Toolbar from './lib/components/Toolbar.svelte';
	import SongView from './lib/components/Song/SongView.svelte';

	const restored = restoreAutosaved();
	songStore.load(restored ?? parseSong(exampleXml));

	$effect(() => {
		autosave(songStore.song);
	});
</script>

<main>
	<header>
		<h1>Leadsheet</h1>
	</header>
	<Toolbar />
	<SongView />
</main>

<style>
	main {
		max-width: 60rem;
		margin: 0 auto;
	}

	header {
		padding: 0.75rem 1rem 0;
	}

	h1 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0;
		color: #333;
	}
</style>
