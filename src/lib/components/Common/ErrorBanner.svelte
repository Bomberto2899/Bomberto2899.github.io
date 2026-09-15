<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class="error-banner" role="alert">{message}</div>

<style>
	.error-banner {
		background: #fdeaea;
		color: #8a1f1f;
		border: 1px solid #e2a1a1;
		border-radius: 4px;
		padding: 0.4rem 0.6rem;
		font-size: 0.85rem;
		margin: 0.25rem 0;
	}
</style>
