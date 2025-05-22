<script lang="ts">
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import { formatDate } from '$lib/utils/dateFormat';

	const {
	columns = [],
	items = [],
	columnTypes = {},
	onCellChange = () => {},
	onRowClick = () => {},
	onEdit = () => {},
	onDelete = () => {}
} = $props<{
	columns?: string[];
	items?: any[];
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

function isDateColumn(columnName: string): boolean {
	const dateColumns = ['date', 'fecha', 'createdAt', 'updatedAt', 'orderDate', 'expectedArrival', 'deliveryDate'];
	return dateColumns.some(dateCol => columnName.toLowerCase().includes(dateCol));
}

function formatDateValue(value: any): string {
	if (!value) return '';
	const date = new Date(value);
	return isNaN(date.getTime()) ? value : formatDate(date, 'd MMM yyyy');
}


</script>

<div class="bg-white max-w-screen shadow-lg rounded-2xl p-6 w-full">
    <div class="w-full max-w-screen overflow-x-auto">
        <div class="max-w-screen w-full">
            <table class="w-full max-w-screen text-sm text-gray-700">
                <colgroup>
                    {#each columns as _}
                        <col class="min-w-[10px] max-w-[100px] w-auto">
                    {/each}
                    <col class="">
                </colgroup>
                <thead class="sticky top-0 bg-indigo-50 border-b border-gray-200 text-gray-500 z-10">
                    <tr>
                        {#each columns as col}
                            <th class="px-4 py-3 text-center max-w-[100px] font-semibold whitespace-nowrap">{formatHeader(col)}</th>
                        {/each}
                        <th class="px-4 py-3 text-center font-semibold"></th>
                    </tr>
                </thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each items as item (item.id)}
						<tr
							class="group relative border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
							onclick={(e: MouseEvent) => {
								const target = e.target as HTMLElement;
								const isInteractive = target.closest('select, input, button, [role="button"], [role="combobox"], [contenteditable]');
								if (!isInteractive && onRowClick) {
									onRowClick(item);
								}
							}}
						>
							{#each columns as col}
								<td class="px-4 py-4 text-center whitespace-nowrap h-9 max-w-[100px] overflow-hidden text-ellipsis align-middle">
									{#if columnTypes[col]}
										{#if columnTypes[col].type === 'select'}
										<div class="w-full" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()}
										tabindex="0" role="button">
										<Select
											bind:value={item[col]}
											size="md"
											options={columnTypes[col].options}
											onValueChange={(val) => handleCellChange(item, col, val)}								
										/>
									</div>
										{:else if columnTypes[col].type === 'textarea'}
										<div class="w-full" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()}
											tabindex="0" role="button">
											<TextArea
												bind:value={item[col]}
												onValueChange={(val) => handleCellChange(item, col, val)}
											/>
										</div>
										{:else}
											<div class="w-full" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()}
												tabindex="0" role="button">
												<TextInput
													bind:value={item[col]}
													size="sm"
													type={columnTypes[col].inputType || columnTypes[col].type || 'text'}
													min={columnTypes[col].min}
													max={columnTypes[col].max}
													step={columnTypes[col].step}
													onValueChange={(val) => handleCellChange(item, col, val)}
													extraClass="w-full"
												/>
											</div>
										{/if}												
										{:else}
											<div class="w-full h-full flex items-center justify-center">
												<span class="truncate text-gray-700">
													{isDateColumn(col) ? formatDateValue(item[col]) : item[col]}
												</span>
											</div>

										{/if}
									
								</td>
							{/each}
							<td class="px-4 py-3  whitespace-nowrap">
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
