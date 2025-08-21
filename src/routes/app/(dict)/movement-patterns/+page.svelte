<script lang="ts">
	import Crud from '$lib/components/Crud.svelte';
	import { allPatterns, createPattern, deletePattern, updatePattern } from './form.remote';

	let { data } = $props();
	let patterns = $state(data.patterns);

	async function reload() {
		patterns = await allPatterns();
	}

	const schema = [
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'description', label: 'Description', type: 'textarea' }
	];
</script>

<Crud
	items={patterns}
	createItem={createPattern}
	updateItem={updatePattern}
	deleteItem={deletePattern}
	title="Movement Patterns"
	{reload}
	{schema}
/>
