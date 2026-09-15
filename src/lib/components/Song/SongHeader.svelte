<script lang="ts">
	import type { Metadata } from '../../model/types';
	import { getSongAuthor, getSongName } from '../../metadata/fieldRegistry';

	let { metadata }: { metadata: Metadata } = $props();

	let name = $derived(getSongName(metadata));
	let author = $derived(getSongAuthor(metadata));
</script>

{#if name || author}
	<div class="song-header">
		{#if name}<h2 class="title">{name}</h2>{/if}
		{#if author}<p class="author">by {author}</p>{/if}
	</div>
{/if}

<style>
	.song-header {
		padding: 0.75rem 1rem 0;
	}

	.title {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 700;
		color: #1a1a1a;
	}

	.author {
		margin: 0.15rem 0 0;
		font-size: 0.9rem;
		color: #666;
		font-style: italic;
	}
</style>
