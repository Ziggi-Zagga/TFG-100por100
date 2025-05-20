<script lang="ts">
	let {
		items = [],
		label,
		name,
		required = false,
		placeholder = 'Search...',
		disabled = false,
		value = $bindable<string>(),
		searchQuery = $bindable<string>(),
		onValueChange
	} = $props<{
		items?: any[];
		label?: string;
		name?: string;
		required?: boolean;
		placeholder?: string;
		disabled?: boolean;
		value?: string;
		searchQuery?: string;
		onValueChange?: (item: any) => void;
	}>();

	let open = $state(false);

	let filteredItems = $derived(() =>
		searchQuery.length === 0
			? items
			: items.filter((item: any) =>
					(item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
				)
	);

	function handleSelect(item: any) {
		value = item.name || item.title;
		searchQuery = value;
		open = false;
		onValueChange?.(item);
	}
</script>

<div class="relative flex flex-col gap-1.5">
	{#if label}
		<label class="text-sm font-medium tracking-wide text-brand-700" for={name}>
			{label}
			{#if required}<span class="text-coral-500">*</span>{/if}
		</label>
	{/if}

	<div class="relative">
		<input
			type="text"
			id={name}
			name={name}
			bind:value
			oninput={(e) => {
				searchQuery = e.currentTarget.value;
				open = true;
			}}
			onfocus={() => (open = true)}
			onblur={() => setTimeout(() => (open = false), 100)}
			placeholder={placeholder}
			class="w-full rounded-xl border border-brand-300 bg-white/50 px-4 py-2.5 font-inter text-brand-700 transition-colors duration-300 placeholder:text-brand-700/50 hover:border-purple-600 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
			{required}
			{disabled}
		/>

		{#if open && filteredItems().length > 0}
			<div class="absolute z-[101] mt-1 w-full overflow-hidden rounded-xl border border-brand-300 bg-white shadow-lg">
				<ul class="max-h-60 overflow-auto py-1">
					{#each filteredItems() as item, i}
						<li>
							{#if i !== 0}
								<div class="flex justify-center">
									<div class="h-px w-3/4 bg-brand-200 my-1"></div>
								</div>
							{/if}
							<button
								type="button"
								class="flex w-full items-center px-4 py-2 hover:bg-gray-100 text-brand-700 text-left transition"
								onclick={() => handleSelect(item)}
							>
								{#if item.images?.[0]}
									<img src={item.images[0].url} alt={item.name} class="h-8 w-8 rounded-lg object-cover" />
								{:else if item.image}
									<img src={item.image} alt={item.name} class="h-8 w-8 rounded-lg object-cover" />
								{/if}
								<span class="ml-3 font-inter">{item.name || item.title}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
