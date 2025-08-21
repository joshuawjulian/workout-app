<script lang="ts">
	import Crud from '$lib/components/Crud.svelte';
	import { allMovements, createMovement, deleteMovement, updateMovement } from './form.remote';
	import type { PageData } from './$types';

	let { data } = $props<PageData>();
	let movements = $state(data.movements);

	async function reload() {
		movements = await allMovements();
	}

	const schema = [
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'youtubeUrl', label: 'YouTube URL', type: 'text' },
		{
			name: 'parentMovementId',
			label: 'Parent Movement',
			type: 'select',
			options: data.movements.map((m) => ({ value: m.id, label: m.name }))
		},
		{
			name: 'movementPatternIds',
			label: 'Movement Patterns',
			type: 'multiselect',
			options: data.movementPatterns.map((p) => ({ value: p.id, label: p.name }))
		}
	];
</script>

<Crud
	items={movements}
	createItem={createMovement}
	updateItem={updateMovement}
	deleteItem={deleteMovement}
	title="Movements"
	{reload}
	{schema}
/>