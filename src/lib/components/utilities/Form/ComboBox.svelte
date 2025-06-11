<script lang="ts">
	let {
		items = $bindable(),
		onSelect,
		loading = false,
		searchQuery = $bindable(),
		value = $bindable(),
		label,
		name,
		required = false,
		placeholder = 'Search...',
		onChange,
		onFocus,
		open = $bindable(),
		filterInternally = true,
		disabled = false,
		displayField = 'name',
		quickSearch = false
	}: {
		items: any[];
		onSelect: (item: any) => void;
		loading?: boolean;
		searchQuery: string;
		value: string;
		label: string;
		name: string;
		required?: boolean;
		placeholder?: string;
		onChange?: (value: string) => void;
		onFocus?: () => void;
		open?: boolean;
		filterInternally?: boolean;
		disabled?: boolean;
		displayField?: string;
		quickSearch?: boolean;
	} = $props();

	if (open === undefined) {
		open = false;
	}

	let filteredItems = $derived(
		filterInternally
			? searchQuery?.length === 0
				? items || []
				: (items || []).filter((item) =>
						(item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
					)
			: items || []
	);

	function handleSelect(item: any) {
		if (quickSearch) {
			onSelect?.(item);
			searchQuery = '';
			value = '';
		} else {
			onSelect?.(item);
			if (displayField && item[displayField]) {
				value = item[displayField];
			} else {
				value = item.name || item.title || '';
			}
		}
		open = false;
	}
</script>

<div class="relative flex flex-col gap-1.5">
	{#if label}
		<label class="text-brand-700 text-sm font-medium tracking-wide" for={name}>
			{label}
			{#if required}
				<span class="text-coral-500">*</span>
			{/if}
		</label>
	{/if}
	<div class="relative">
		<input
			type="text"
			id={name}
			{name}
			bind:value
			oninput={(e) => {
				if (onChange) onChange(e.currentTarget.value);
				searchQuery = e.currentTarget.value;
				if (searchQuery.length > 0) open = true;
			}}
			onfocus={() => {
				open = true;
				if (onFocus) onFocus();
			}}
			onblur={() => {
				setTimeout(() => {
					open = false;
				}, 100);
			}}
			class="border-brand-300 font-inter text-brand-700 placeholder:text-brand-700/50 w-full rounded-xl border bg-white/50 px-4 py-2.5 transition-colors duration-300 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
			{placeholder}
			{required}
			{disabled}
		/>

		{#if loading}
			<div class="absolute top-1/2 right-3 -translate-y-1/2">
				<div
					class="border-brand-500 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
				></div>
			</div>
		{/if}

		{#if open && (items?.length > 0 || searchQuery) && !loading}
			<div
				class="border-brand-300 absolute z-[101] mt-1 w-full overflow-hidden rounded-xl border bg-white shadow-lg"
			>
				<ul class="max-h-60 overflow-auto py-1">
					{#if searchQuery && !filterInternally}
						<li>
							<button
								type="button"
								class="text-brand-700 flex w-full items-center px-4 py-2.5 transition-colors duration-300 hover:bg-gray-100"
								onclick={() => {
									onSelect(searchQuery);
									open = false;
								}}
							>
								<span class="font-inter ml-3">Create "{searchQuery}"</span>
							</button>
						</li>
						{#if items.length > 0}
							<li>
								<div class="border-brand-200 mx-4 my-1 border-t"></div>
							</li>
						{/if}
					{/if}

					{#each filteredItems as item}
						<li class="flex w-full">
							<button
								type="button"
								class="text-brand-700 flex w-full cursor-pointer items-center px-4 py-2.5 text-left transition-colors duration-300 hover:bg-gray-100"
								onclick={() => handleSelect(item)}
							>
								{#if item.images?.[0]}
									<img
										src={item.images[0].url}
										alt={item.name}
										class="h-8 w-8 rounded-lg object-cover"
									/>
								{/if}
								{#if item.image}
									<img src={item.image} alt={item.name} class="h-8 w-8 rounded-lg object-cover" />
								{/if}
								<span class="font-inter ml-3">
									{#if displayField && item[displayField]}
										{@html item[displayField]}
									{:else}
										{item.name || item.title || item.label || item.value || item.id}
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
