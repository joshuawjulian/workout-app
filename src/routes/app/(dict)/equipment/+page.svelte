<script lang="ts">
	import type { EquipmentSelectType } from '$lib/schema/dict.schema';
	import {
		addRandomEquipment,
		allEquipment,
		deleteEquipment,
		upsertEquipment
	} from './form.remote';

	let upsertEquipmentModal: HTMLDialogElement;

	let selectedItem: EquipmentSelectType | null = $state(null);

	function openModal(item: EquipmentSelectType | null = null) {
		selectedItem = item;
		upsertEquipmentModal?.showModal();
	}

	async function closeModal() {
		upsertEquipmentModal?.close();
	}
</script>

<div class="card bg-base-100">
	<div class="card-body">
		<h2 class="card-title">Equipment</h2>
		<button class="btn btn-sm btn-primary" onclick={() => openModal()}>Add Equipment</button>
		<button class="btn btn-sm btn-primary" onclick={async () => await allEquipment().refresh()}
			>Refresh</button>
		<button class="btn btn-sm btn-primary" onclick={async () => await addRandomEquipment()}>
			Add Random Equipment
		</button>
		<svelte:boundary>
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
			<table class="table table-zebra w-full">
				<thead>
					<tr>
						<th>id</th>
						<th>Name</th>
						<th>Actions</th>
						<th>{(await allEquipment()).length}</th>
					</tr>
				</thead>
				<tbody>
					{#each await allEquipment() as item}
						<tr>
							<td>{item.id}</td>
							<td>{item.name}</td>
							<td>
								<button class="btn btn-sm btn-secondary" onclick={() => openModal(item)}
									>Edit</button>
								<button
									class="btn btn-sm btn-danger"
									onclick={async () => await deleteEquipment(item.id)}>Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</svelte:boundary>
	</div>
</div>

<dialog id="upsertEquipmentModal" bind:this={upsertEquipmentModal} class="modal">
	<div class="modal-box flex flex-col">
		<form method="dialog">
			<button class="btn btn-circle absolute right-2 top-2">✕</button>
		</form>
		<form {...upsertEquipment} class="flex flex-col space-y-4">
			<h3 class="text-lg font-bold mb-4">{selectedItem ? 'Edit' : 'Add'} Equipment</h3>
			{#if selectedItem}
				<input type="hidden" name="id" value={selectedItem.id} />
			{/if}
			<input
				type="text"
				placeholder="Equipment Name"
				class="input input-bordered w-full"
				name="name"
				value={selectedItem?.name || ''} />
			<div class="form-control">
				<button type="submit" class="btn btn-primary mt-4" onclick={async () => await closeModal()}>
					Save</button>
			</div>
		</form>
	</div>
</dialog>
