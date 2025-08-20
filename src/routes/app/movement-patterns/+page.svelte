<!-- src/routes/todos/+page.svelte -->
<script lang="ts">
	import type { PageProps } from './$types';
	import { allPatterns, createPattern } from './form.remote';

	let { data }: PageProps = $props();
</script>

<h1>Movement Patterns</h1>

<svelte:boundary>
	{#snippet pending()}
		<p>Loading...</p>
	{/snippet}
	<ul>
		{#each await allPatterns() as pattern}
			<li>{pattern.name}</li>
		{/each}
	</ul>

	<form {...createPattern}>
		<label>
			<h2>Movement Pattern Name</h2>
			<input name="name" />
		</label>
		<button>Add Movement Pattern</button>
	</form>
</svelte:boundary>
