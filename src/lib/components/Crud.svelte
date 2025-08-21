<script lang="ts">
	import type { MovementPatternsSelectType } from '$lib/schema/dict.schema';

	type Item = $$Generic<MovementPatternsSelectType>;

	interface Field {
		name: string;
		label: string;
		type: 'text' | 'textarea' | 'select' | 'multiselect';
		options?: { value: string; label: string }[];
	}

	let {
		items,
		createItem,
		updateItem,
		deleteItem,
		title,
		reload,
		schema
	}: {
		items: Item[];
		createItem: any;
		updateItem: any;
		deleteItem: any;
		title: string;
		reload: () => Promise<any>;
		schema: Field[];
	} = $props();

	let showModal = $state(false);
	let selectedItem = $state<Item | null>(null);

	function openModal(item: Item | null = null) {
		selectedItem = item;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedItem = null;
	}

	async function handleDelete(item: Item) {
		if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
			const formData = new FormData();
			formData.append('id', String(item.id));
			await deleteItem(formData);
			await reload();
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="flex justify-between items-center mb-4">
			<h2 class="card-title">{title}</h2>
			<button class="btn btn-primary" onclick={() => openModal()}>Add New</button>
		</div>

		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						{#each schema as field}
							<th>{field.label}</th>
						{/each}
						<th class="w-40"></th>
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<tr>
							{#each schema as field}
								<td>{item[field.name]}</td>
							{/each}
							<td class="text-right">
								<button class="btn btn-ghost btn-sm" onclick={() => openModal(item)}>Edit</button>
								<button class="btn btn-ghost btn-sm text-error" onclick={() => handleDelete(item)}>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

{#if showModal}
	<dialog id="crud_modal" class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">{selectedItem ? 'Edit' : 'Create'} {title}</h3>

			<form
				class="py-4"
				method="POST"
				{...(selectedItem ? updateItem : createItem).enhance(async ({ submit }) => {
					await submit();
					await reload();
					closeModal();
				})}
			>
				{#if selectedItem}
					<input type="hidden" name="id" value={selectedItem.id} />
				{/if}

				{#each schema as field}
					<div class="form-control mt-4">
						<label class="label" for={field.name}>
							<span class="label-text">{field.label}</span>
						</label>
						{#if field.type === 'textarea'}
							<textarea
								id={field.name}
								name={field.name}
								class="textarea textarea-bordered"
								value={selectedItem?.[field.name] || ''}
								required
							></textarea>
						{:else if field.type === 'select'}
							<select
								id={field.name}
								name={field.name}
								class="select select-bordered"
								value={selectedItem?.[field.name] || ''}
								required
							>
								{#each field.options as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						{:else if field.type === 'multiselect'}
							<select
								id={field.name}
								name={field.name}
								class="select select-bordered"
								multiple
								value={selectedItem?.[field.name] || []}
								required
							>
								{#each field.options as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						{:else}
							<input
								type={field.type}
								id={field.name}
								name={field.name}
								class="input input-bordered"
								value={selectedItem?.[field.name] || ''}
								required
							/>
						{/if}
					</div>
				{/each}

				<div class="modal-action">
					<button type="button" class="btn" onclick={closeModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">{selectedItem ? 'Update' : 'Create'}</button
					>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button onclick={closeModal}>close</button>
		</form>
	</dialog>
{/if}
