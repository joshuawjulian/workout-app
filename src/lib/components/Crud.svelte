<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	type Item = $$Generic<Record<string, any> & { id: string | number; name?: string }>;

	interface Field {
		name: string;
		label: string;
		type: 'text' | 'textarea' | 'select' | 'multiselect';
		options?: { value: any; label: string }[];
		displayOptions?: { value: any; label: string }[];
	}

	let {
		items,
		title,
		schema,
		createAction,
		updateAction,
		deleteAction,
		reload
	}: {
		items: Item[];
		title: string;
		schema: Field[];
		createAction: (data: FormData) => Promise<any>;
		updateAction: (data: FormData) => Promise<any>;
		deleteAction: (data: FormData) => Promise<any>;
		reload: () => Promise<any>;
	} = $props();

	let selectedItem = $state<Item | null>(null);
	let dialog: HTMLDialogElement;

	function openModal(item: Item | null = null) {
		selectedItem = item;
		dialog?.showModal();
	}

	function closeModal() {
		dialog?.close();
	}

	const handleSubmit: SubmitFunction = ({ form, data, action, cancel }) => {
		cancel(); // Prevent default form submission

		const formData = new FormData(form);

		let promise;
		if (form.id === 'delete-form') {
			promise = deleteAction(formData);
		} else {
			promise = selectedItem ? updateAction(formData) : createAction(formData);
		}

		promise.then(() => {
			reload();
			if (form.id !== 'delete-form') {
				closeModal();
			}
		});
	};

	function getDisplayValue(item: Item, field: Field) {
		const value = item[field.name];
		if (field.type === 'multiselect') {
			if (!Array.isArray(value)) return '';
			const displayOptions = field.displayOptions || field.options || [];
			return value
				.map((v) => displayOptions.find((opt) => opt.value == v)?.label || v)
				.join(', ');
		}
		if (field.type === 'select') {
			const displayOptions = field.displayOptions || field.options || [];
			return displayOptions.find((opt) => opt.value == value)?.label || value;
		}
		return value;
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
					{#each items as item (item.id)}
						<tr>
							{#each schema as field}
								<td>{getDisplayValue(item, field)}</td>
							{/each}
							<td class="text-right flex items-center justify-end">
								<button class="btn btn-ghost btn-sm" onclick={() => openModal(item)}>Edit</button>
								<form
									id="delete-form"
									use:enhance={handleSubmit}
									method="POST"
									onsubmit={(e) => {
										if (!confirm(`Are you sure you want to delete "${item.name || 'this item'}"?`)) {
											e.preventDefault();
										}
									}}
								>
									<input type="hidden" name="id" value={item.id} />
									<button type="submit" class="btn btn-ghost btn-sm text-error">
										Delete
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<dialog bind:this={dialog} id="crud_modal" class="modal" onclose={() => (selectedItem = null)}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">{selectedItem ? 'Edit' : 'Create'} {title}</h3>

		<form
			method="POST"
			use:enhance={handleSubmit}
			class="py-4"
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
							required
						>
                            <option value="" disabled selected={selectedItem?.[field.name] == null}>Select one</option>
							{#each field.options ?? [] as option}
								<option value={option.value} selected={selectedItem?.[field.name] == option.value}>{option.label}</option>
							{/each}
						</select>
					{:else if field.type === 'multiselect'}
						<div class="border border-base-300 rounded-lg p-2 max-h-48 overflow-y-auto">
							{#each field.options ?? [] as option}
								<label class="label cursor-pointer">
									<span class="label-text">{option.label}</span>
									<input
										type="checkbox"
										name={field.name}
										value={option.value}
										checked={selectedItem?.[field.name]?.includes(option.value)}
										class="checkbox"
									/>
								</label>
							{/each}
						</div>
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
				<button type="submit" class="btn btn-primary">{selectedItem ? 'Update' : 'Create'}</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>