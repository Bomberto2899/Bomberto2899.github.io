<script lang="ts">
	import { ALIAS_HELP } from '../editor/aliases';

	let { onClose }: { onClose: () => void } = $props();

	const EXAMPLE_BAR = `<bar>
	<chords>
		<chord>C</chord>
		<chord>Am</chord>
		<chord beat="4">F</chord>
		<chord beat="4">G7</chord>
	</chords>
	<lyrics>
		<lyric>Some words</lyric>
		<lyric beat="3">more words</lyric>
	</lyrics>
</bar>`;
</script>

<div class="help">
	<div class="help-header">
		<h2>Help</h2>
		<button class="close" onclick={onClose} title="Close help">&times;</button>
	</div>

	<div class="columns">
		<div>
			<h3>Structure of a bar</h3>
			<p>Click a bar to edit it as XML. A bar looks like this:</p>
			<pre>{EXAMPLE_BAR}</pre>
			<ul>
				<li>
					<code>&lt;chords&gt;</code> and <code>&lt;lyrics&gt;</code> are both optional.
				</li>
				<li>
					Chords and lyrics without a <code>beat</code> are spread over the beats that aren't
					taken yet.
				</li>
				<li>
					<code>beat="N"</code> places it on beat N. Several on the same beat share that beat
					(above, F and G7 split beat 4).
				</li>
				<li>
					<code>romannumerals="true"</code> on a chord means it's written as a roman numeral
					(e.g. <code>IV</code>) relative to the song's key.
				</li>
			</ul>
		</div>

		<div>
			<h3>Editor keys</h3>
			<dl>
				<dt><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> or click outside</dt>
				<dd>Save the bar</dd>
				<dt><kbd>Esc</kbd></dt>
				<dd>Cancel your changes</dd>
				<dt><kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd></dt>
				<dd>Indent / outdent the line</dd>
			</dl>

			<h3>\ shortcuts</h3>
			<p>Type the shortcut, then press <kbd>Tab</kbd>.</p>
			<dl>
				{#each ALIAS_HELP as { alias, description } (alias)}
					<dt><code>{alias}</code></dt>
					<dd>{description}</dd>
				{/each}
			</dl>
		</div>
	</div>
</div>

<style>
	.help {
		margin-top: 0.5rem;
		padding: 0.75rem 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: #fcfcfd;
		font-size: 0.85rem;
		color: #333;
	}

	.help-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		margin: 0;
		font-size: 1rem;
	}

	h3 {
		margin: 0.75rem 0 0.35rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: #555;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		gap: 0 1.5rem;
	}

	p {
		margin: 0.35rem 0;
	}

	pre {
		margin: 0.35rem 0;
		padding: 0.5rem;
		background: #f3f5f8;
		border-radius: 4px;
		font-size: 0.8rem;
		tab-size: 2;
		overflow-x: auto;
	}

	code,
	pre,
	kbd {
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
	}

	kbd {
		padding: 0 0.25rem;
		border: 1px solid #ccc;
		border-bottom-width: 2px;
		border-radius: 3px;
		font-size: 0.75rem;
		background: white;
	}

	ul {
		margin: 0.35rem 0;
		padding-left: 1.1rem;
	}

	li {
		margin: 0.2rem 0;
	}

	dl {
		margin: 0.35rem 0;
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.3rem 0.75rem;
	}

	dt {
		font-weight: 600;
	}

	dd {
		margin: 0;
	}

	.close {
		border: none;
		background: transparent;
		color: #999;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
	}

	.close:hover {
		color: #333;
	}
</style>
