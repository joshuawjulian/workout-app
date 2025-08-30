<script lang="ts">
	type Option = { value: string; label: string };

	let {
		options,
		selected,
		name,
		placeholder = 'Select options...'
	}: {
		options: Option[];
		selected: string[];
		name: string;
		placeholder?: string;
	} = $props();

	let searchTerm = $state('');
	let isDropdownOpen = $state(false);
	let selectedValues = $state(selected);

	const filteredOptions = $derived(
		options.filter((option) => {
			const isSelected = selectedValues.includes(option.value);
			const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase());
			return !isSelected && matchesSearch;
		})
	);

	const selectedOptions = $derived(
		selectedValues.map((value) => options.find((opt) => opt.value === value)!)
	);

	function handleSelect(option: Option) {
		selectedValues.push(option.value);
		selectedValues = selectedValues; // Re-assign to trigger reactivity
		searchTerm = '';
	}

	function handleRemove(valueToRemove: string) {
		selectedValues = selectedValues.filter((v) => v !== valueToRemove);
	}
</script>

<div class="dropdown w-full" class:dropdown-open={isDropdownOpen}>
	{#each selectedValues as value}
		<input type="hidden" {name} {value} />
	{/each}

	<div class="flex flex-wrap gap-2">
		{#each selectedOptions as option}
			{#if option}
				<div class="badge badge-primary gap-2">
					{option.label}
					<button
						type="button"
						class="btn btn-xs btn-circle btn-ghost"
						onclick={() => handleRemove(option.value)}
					>
						&times;
					</button>
				</div>
			{/if}
		{/each}
	</div>
	<label class="input input-bordered items-center gap-2 flex-wrap w-full cursor-text">
		<input
			type="text"
			class="input input-ghost flex-grow p-0"
			bind:value={searchTerm}
			{placeholder}
			onfocus={() => (isDropdownOpen = true)}
			onblur={() => setTimeout(() => (isDropdownOpen = false), 150)}
		/>
	</label>
	{#if filteredOptions.length > 0}
		<ul class="dropdown-content z-[1] menu flex flexp-2 shadow bg-base-100 rounded-box w-full mt-2">
			{#each filteredOptions as option}
				<li>
					<button
						class="btn btn-ghost"
						onclick={(e) => {
							e.preventDefault();
							handleSelect(option);
						}}>{option.label}</button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
