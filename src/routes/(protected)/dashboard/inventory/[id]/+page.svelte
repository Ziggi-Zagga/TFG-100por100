<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import ShowText from '$lib/components/utilities/ShowText/ShowText.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/utilities/Form/ComboBox.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let inventory = $state(data.inventory);
	let product = $state(data.product);
	let location = $state([...data.location]);
	let inventoryHistory = $state([...data.history]);
	let isEditing = $state(false);
	let id = $state(page.params.id);
	let showHistory = $state(false);

	let fullwarehouseTree = $state([...data.fullwarehouseTree]);

	let selectedwarehouse = $state(location[0].warehouseName);
	let selectedSection = $state(location[0].sectionName);
	let selectedRow = $state(location[0].rowName);
	let selectedGapName = $state(location[0].gapName);
	let selectedGapId = $state(location[0].gapId);

	let selectedHistory = $state(inventoryHistory[0]);

	console.log(id);

	onMount(() => {
		const urlParams = new URLSearchParams(page.url.search);
		if (urlParams.get('edit') === 'true') {
			isEditing = true;
		}
	});

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function handleDelete() {
		showConfirm = true;
	}

	function cancelDeletion() {
		showConfirm = false;
	}

	function onHistoryClick(item: any) {
		selectedHistory = item;
		showHistory = true;
	}

	function handlewarehouseChange(warehouse: any) {
		selectedwarehouse = warehouse.name;
		selectedSection = '';
		selectedRow = '';
		selectedGapName = '';
		selectedGapId = '';
	}

	function handleSectionChange(section: any) {
		selectedSection = section.name;
		selectedRow = '';
		selectedGapName = '';
		selectedGapId = '';
	}

	function handleRowChange(row: any) {
		selectedRow = row.name;
		selectedGapName = '';
		selectedGapId = '';
	}

	function handleGapChange(gap: any) {
		selectedGapId = gap.id;
		selectedGapName = gap.name;
	}

	const warehouse = $derived(() =>
		Array.from(
			new Map(
				fullwarehouseTree.map((i) => [i.warehouseId, { id: i.warehouseId, name: i.warehouseName }])
			).values()
		)
	);

	const sections = $derived(() =>
		selectedwarehouse
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.warehouseId && i.warehouseName === selectedwarehouse && i.sectionId)
							.map((i) => [i.sectionId, { id: i.sectionId, name: i.sectionName }])
					).values()
				)
			: []
	);

	const rows = $derived(() =>
		selectedSection
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.sectionName === selectedSection && i.rowId)
							.map((i) => [i.rowId, { id: i.rowId, name: i.rowName }])
					).values()
				)
			: []
	);

	const gaps = $derived(() =>
		selectedRow
			? Array.from(
					new Map(
						fullwarehouseTree
							.filter((i) => i.rowName === selectedRow && i.gapId)
							.map((i) => [i.gapId, { id: i.gapId, name: i.gapName }])
					).values()
				)
			: []
	);

	async function confirmDeletion() {
		const formData = new FormData();
		formData.append('id', product?.id ?? '');

		const res = await fetch('/dashboard/inventory?/delete', {
			method: 'POST',
			body: formData
		});

		showConfirm = false;

		if (res.ok) {
			goto('/dashboard/inventory');
		} else {
			console.error('Failed to delete inventory');
		}
	}

	let showConfirm = $state(false);
</script>

<section
	class="flex min-h-screen justify-center px-4 pt-0 pb-4 md:px-8 md:pb-8"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<div class="flex w-full max-w-screen-xl flex-col gap-6 px-4 py-6 md:flex-row">
		<div class="w-full space-y-6 rounded-2xl bg-white p-6 shadow-lg md:w-1/2">
			<Header title={product?.name ?? ''} subtitle="">
				<button
					onclick={toggleEdit}
					class="text-2xl transition hover:scale-110 hover:text-blue-600"
				>
					<Icon icon="edit" size={30} />
				</button>
				<button
					onclick={handleDelete}
					class="text-2xl transition hover:scale-110 hover:text-red-600"
				>
					<Icon icon="delete" size={30} />
				</button>
			</Header>
			<div>
				<Header title="Stock Information" subtitle="" extraStyles="compact" />
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<ShowText label="Actual Stock" value={inventory.quantity} />
					<ShowText label="Minimum Stock" value={inventory.minQuantity} />
					<ShowText label="Reorder Quantity" value={inventory.reorderQuantity} />
				</div>
			</div>
			<div>
				<Header title="Location" subtitle="" extraStyles="compact" />
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<ShowText label="Section" value={location[0].sectionName} />
					<ShowText label="Row" value={location[0].rowName} />
					<ShowText label="warehouse" value={location[0].warehouseName} />
					<ShowText label="Gap" value={location[0].gapName} />
				</div>
			</div>
		</div>
		<div class="mt-4 w-full md:mt-0 md:w-1/2">
			<Header title="Product History" subtitle="" extraStyles="compact" />
			<Table
				columns={['fromLocation', 'toLocation', 'previousQuantity', 'newQuantity']}
				items={inventoryHistory}
				onRowClick={(item) => onHistoryClick(item)}
				ifEdit={() => false}
				ifDelete={() => false}
			/>
		</div>
	</div>

	{#if isEditing}
		<Modal title="➕ Edit Inventory" onClose={toggleEdit}>
			<form method="POST" action="?/update" class="p-6">
				<Header title="Product Information" subtitle="" extraStyles="compact" />
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<TextInput
						label="Actual Stock"
						name="quantity"
						type="number"
						min={0}
						placeholder="Enter product stock"
						value={inventory.quantity ?? undefined}
						required
					/>
					<TextInput
						label="Minimum Stock"
						name="minQuantity"
						type="number"
						min={0}
						placeholder="Enter minimum stock"
						value={inventory.minQuantity ?? undefined}
						required
					/>
					<TextInput
						label="Reorder Quantity"
						name="reorderQuantity"
						type="number"
						min={0}
						placeholder="Enter reorder quantity"
						value={inventory.reorderQuantity ?? undefined}
						required
					/>
				</div>

				<br />
				<Header title="Location" subtitle="" extraStyles="compact" />
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
					<ComboBox
						label="warehouse"
						name="warehouseId"
						items={warehouse()}
						searchQuery={selectedwarehouse}
						onSelect={(item) => handlewarehouseChange(item)}
						value={selectedwarehouse}
					/>
					<ComboBox
						label="Section"
						name="sectionId"
						items={sections()}
						searchQuery={selectedSection}
						onSelect={(item) => handleSectionChange(item)}
						value={selectedSection}
					/>
					<ComboBox
						label="Row"
						name="rowId"
						items={rows()}
						searchQuery={selectedRow}
						onSelect={(item) => handleRowChange(item)}
						value={selectedRow}
					/>
					<ComboBox
						label="Gap"
						name="gapName"
						items={gaps()}
						searchQuery={selectedGapName}
						onSelect={(item) => handleGapChange(item)}
						value={selectedGapName}
						required
					/>
				</div>

				<br />
				<TextInput label="Notes" name="notes" type="textArea" placeholder="Enter notes" />

				<input type="hidden" name="productId" value={inventory.productId} />
				<input type="hidden" name="lastwarehouseGapId" value={inventory.warehouseGapId} />
				<input type="hidden" name="lastStock" value={inventory.quantity} />

				<div class="mt-6 flex justify-end gap-4">
					<Button onclick={toggleEdit} variant="secondary" size="md" extraStyles="w-full md:w-auto">
						{@html '<span class="hidden md:inline">Cancel</span>'}
					</Button>
					<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
						{@html '<span class="hidden md:inline">Update Inventory</span>'}
					</Button>
				</div>

				<input type="hidden" name="productId" value={inventory.productId} />
				<input type="hidden" name="gapId" value={selectedGapId} />
				<input type="hidden" name="id" value={id} />
			</form>
		</Modal>
	{/if}

	{#if showHistory}
		<Modal title="Inventory History" size="lg" onClose={() => (showHistory = false)}>
			<Header title="Stock" subtitle="" extraStyles="compact" />
			<div class="grid grid-cols-3 gap-x-6 gap-y-2 pb-6">
				<ShowText label="Actual Stock" value={selectedHistory.newQuantity} />
				<ShowText label="Minimum Stock" value={selectedHistory.previousQuantity} />
				<ShowText label="Reorder Quantity" value={selectedHistory.quantityChanged} />
			</div>

			<Header title="Location" subtitle="" extraStyles="compact" />
			<div class="grid grid-cols-2 gap-x-6 gap-y-2 pb-6">
				<ShowText label="From Location" value={selectedHistory.fromLocation} />
				<ShowText label="To Location" value={selectedHistory.toLocation} />
			</div>

			<Header title="Other info" subtitle="" extraStyles="compact" />
			<div class="grid grid-cols-2 gap-x-6 gap-y-2 pb-6">
				<ShowText label="User" value={selectedHistory.userName} />
				<ShowText label="Date" value={selectedHistory.createdAt} />
			</div>
			<ShowText label="Notes" value={selectedHistory.notes} />
		</Modal>
	{/if}

	<ConfirmDialog
		show={showConfirm}
		message={`Are you sure you want to eliminate inventory: ${product?.name}?`}
		onConfirm={confirmDeletion}
		onCancel={cancelDeletion}
	/>
</section>
