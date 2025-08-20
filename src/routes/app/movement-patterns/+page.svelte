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
	<ul class="mb-2">
		{#each await allPatterns() as pattern}
			<li><button class="btn">{pattern.name}</button></li>
		{/each}
	</ul>

	<form {...createPattern} class="flex flex-col">
		<label class="input mb-2">
			Name
			<input name="name" class="grow" />
		</label>
		<textarea class="textarea mb-2" placeholder="Description" name="description"></textarea>
		<button class="btn btn-primary">Add Movement Pattern</button>
	</form>
</svelte:boundary>
