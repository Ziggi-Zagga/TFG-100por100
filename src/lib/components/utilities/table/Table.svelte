<script lang="ts">
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';

	const {
	columns = [],
	items = [],
	highlightQuantity = false,
	columnTypes = {},
	onCellChange = () => {},
	onRowClick = () => {},
	onEdit = () => {},
	onDelete = () => {}
} = $props<{
	columns?: string[];
	items?: any[];
	highlightQuantity?: boolean;
	columnTypes?: {
		[type: string]: {
			type: 'input' | 'select' | 'textarea';
			options?: any[];
			min?: number;
			max?: number;
			step?: number;
		};
	};
	onCellChange?: (item: any, column: string, value: any) => void;
	onRowClick?: (id: string) => void;
	onEdit?: (item: any) => void;
	onDelete?: (item: any) => void;
}>();


	function handleRowClick(id: string) {
	onRowClick(id);
}

function handleCellChange(item: any, column: string, value: any) {
	item[column] = value;
	onCellChange(item, column, value);
}

function handleEdit(e: MouseEvent, item: any) {
	e.stopPropagation();
	onEdit(item);
}

function handleDelete(e: MouseEvent, item: any, name?: string) {
	e.stopPropagation();
	onDelete(item);
}
function formatHeader(header: string): string {
	return header.charAt(0).toUpperCase() + header.slice(1);
}


</script>

<div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-7xl mx-auto">
	<div class="overflow-x-auto">
		<div class="max-h-[calc(100vh-250px)] overflow-y-auto">
			<table class="w-full table-auto text-sm text-gray-700 min-w-[800px] rounded-xl overflow-hidden shadow-sm">
				<thead class="sticky top-0 bg-indigo-50 border-b border-gray-200 text-gray-500 z-10">
					<tr>
						{#each columns as col}
							<th class="px-4 py-3 text-left font-semibold">{formatHeader(col)}</th>
						{/each}
						<th class="px-4 py-3 text-center font-semibold"></th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each items as item}
						<tr
							class="hover:bg-gray-50 transition cursor-pointer"
							onclick={() => handleRowClick(item.id)}
						>
							{#each columns as col}
								<td class="px-4 py-3 whitespace-nowrap">
									{#if columnTypes[col]}
										{#if columnTypes[col].type === 'select'}
										<Select
										bind:value={item[col]}
										options={columnTypes[col].options}
										onValueChange={(val) => handleCellChange(item, col, val)}
									/>
										{:else if columnTypes[col].type === 'textarea'}
											<TextArea
												bind:value={item[col]}
												onValueChange={(val) => handleCellChange(item, col, val)}
											/>
										{:else}
												<TextInput
												bind:value={item[col]}
												type={columnTypes[col].type}
												min={columnTypes[col].min}
												max={columnTypes[col].max}
												step={columnTypes[col].step}
												onValueChange={(val) => handleCellChange(item, col, val)}
											/>
										{/if}												
										{:else}
										<span class="text-gray-700">
											{item[col]} 
										</span>
										{/if}
									
								</td>
							{/each}
							<td class="px-4 py-3 whitespace-nowrap">
								<div class="flex justify-center gap-3" role="group" aria-label="Row actions">
									<button
										class="text-gray-500 hover:text-blue-600"
										title="Edit"
										aria-label="Edit"
										type="button"
										onclick={(e) => handleEdit(e, item)}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m2 0h.01M7 5h.01M3 21h18M12 17v-5m0 0l-2-2m2 2l2-2" />
										</svg>
									</button>
									<button
										class="text-gray-500 hover:text-red-600"
										title="Delete"
										aria-label="Delete"
										type="button"
										onclick={(e) => handleDelete(e, item)}
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
