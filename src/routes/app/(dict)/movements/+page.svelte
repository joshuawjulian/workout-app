<script lang="ts">
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import type { MovementsInsertType } from '$lib/schema/dict.schema';
	import type { PageProps } from './$types';
	import { allMovements, upsertMovement, type MovementReturnType } from './form.remote';

	let { data }: PageProps = $props();
	let { movements, movementPatterns } = $state(data);

	async function reload() {
		movements = await allMovements();
	}

	let newMovementDialog: HTMLDialogElement;
	let selectedItem = $state<MovementReturnType | MovementsInsertType | null>();

	function openModal(item: MovementReturnType | null = null) {
		selectedItem = item;
		newMovementDialog?.showModal();
	}

	function closeModal() {
		newMovementDialog?.close();
	}
</script>

<dialog
	bind:this={newMovementDialog}
	id="newMovementModal"
	class="modal"
	onclose={() => (selectedItem = null)}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold mb-4">Insert/Update Movement</h3>
		<div>
			<form {...upsertMovement} class="flex flex-col space-y-4">
				<input
					type="text"
					placeholder="Movement Name"
					class="input input-bordered w-full"
					name="name" />
				<input
					type="url"
					placeholder="YouTube URL"
					class="input input-bordered w-full"
					name="youtubeUrl" />
				<textarea
					placeholder="Repetition Criteria"
					class="input input-bordered w-full pt-2 h-24"
					name="repetitionCriteria"></textarea>
				<MultiSelect
					options={movementPatterns.map((pattern) => ({ value: pattern.id, label: pattern.name }))}
					selected={[]}
					name="movementPatternIds" />
				<div class="form-control">
					<label class="label" for="parentMovementId">
						<span class="label-text">Parent Movement</span>
					</label>
					<select
						class="select select-bordered w-full"
						name="parentMovementId"
						id="parentMovementId">
						<option value="">-- None --</option>
						{#each movements as movement}
							<option value={movement.id}>{movement.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<button type="submit" class="btn btn-primary mt-4">Save</button>
				</div>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="card bg-base-100">
	<div class="card-body">
		<h2 class="card-title">Movements</h2>
		<button class="btn btn-sm btn-primary" onclick={() => openModal()}>Add Movement</button>
		<button class="btn btn-sm btn-secondary" onclick={reload}>Reload</button>
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					<th>Name</th>
					<th>Patterns</th>
					<th>Repetition Criteria</th>
				</tr>
			</thead>
			<tbody>
				{#each movements as movement}
					<tr>
						<td>{movement.name}</td>
						<td>
							{movement.movementsToMovementPatterns.map((m) => m.movementPattern.name).join(', ')}
						</td>
						<td>{movement.repetitionCriteria}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
