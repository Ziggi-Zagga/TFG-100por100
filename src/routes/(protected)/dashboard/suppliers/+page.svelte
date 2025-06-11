<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import TextArea from '$lib/components/utilities/Form/TextArea.svelte';
	import type { Manufacturer, Supplier } from '$lib/types/products.types.js';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import { fail } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';

	const { data } = $props();

	let showDrawer = $state(false);
	let isEditing = $state(false);
	let isSuppliers = $state(true);
	let search = $state('');
	let searchManufacturers = $state('');
	let suppliers = $state([...data.suppliers]);
	let manufacturers = $state([...data.manufacturers]);
	let totalSuppliers = $state(data.suppliers.length);
	let totalManufacturers = $state(data.manufacturers.length);
	let wrongName = $state(false);
	let wrongNameManufacturer = $state(false);
	let showConfirm = $state(false);
	let supplierToDelete = $state<string | null>(null);
	let supplierIdToDelete = $state<string | null>(null);

	let editId = $state('');
	let editName = $state('');
	let editEmail = $state('');
	let editContactPerson = $state('');
	let editWebsite = $state('');
	let editPhone = $state('');
	let editNotes = $state('');

	let isEditingManufacturer = $state(false);
	let editIdManufacturer = $state('');
	let editNameManufacturer = $state('');
	let editDescriptionManufacturer = $state('');

	let showConfirmManufacturer = $state(false);
	let manufacturerToDelete = $state<string | null>(null);
	let manufacturerIdToDelete = $state<string | null>(null);

	function openEdit(item: Supplier) {
		isEditing = true;
		editId = item.id;
		editName = item.name;
		editEmail = item.email ?? '';
		editContactPerson = item.contactPerson ?? '';
		editWebsite = item.website ?? '';
		editPhone = item.phone ?? '';
		editNotes = item.notes ?? '';
	}

	function openEditManufacturer(item: Manufacturer) {
		isEditingManufacturer = true;
		editIdManufacturer = item.id;
		editNameManufacturer = item.name;
		editDescriptionManufacturer = item.description ?? '';
	}

	function closeEditManufacturer() {
		isEditingManufacturer = false;
	}

	function closeEdit() {
		isEditing = false;
	}

	function askDelete(supplierId: string, supplierName: string) {
		supplierToDelete = supplierName;
		supplierIdToDelete = supplierId;
		showConfirm = true;
	}

	function askDeleteManufacturer(manufacturerId: string, manufacturerName: string) {
		manufacturerToDelete = manufacturerName;
		manufacturerIdToDelete = manufacturerId;
		showConfirmManufacturer = true;
	}

	function cancelDeletion() {
		showConfirm = false;
		supplierToDelete = null;
		supplierIdToDelete = null;
	}

	function cancelDeletionManufacturer() {
		showConfirmManufacturer = false;
		manufacturerToDelete = null;
		manufacturerIdToDelete = null;
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	async function handleCreate(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('name')?.toString() ?? '';
		const existingSupplier = suppliers.find((s) => s.name === name);

		if (existingSupplier) {
			wrongName = true;
			return fail(400, { message: 'Supplier with this name already exists' });
		}

		wrongName = false;

		const res = await fetch('?/create', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			closeDrawer();
			location.reload();
		} else {
			const error = await res.json();
			console.error('Error creating supplier:', error);
		}
	}

	async function handleCreateManufacturer(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get('name')?.toString() ?? '';
		const existingManufacturer = manufacturers.find((m) => m.name === name);

		if (existingManufacturer) {
			wrongNameManufacturer = true;
			return fail(400, { message: 'Manufacturer with this name already exists' });
		}

		wrongNameManufacturer = false;

		const res = await fetch('?/createManufacturer', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			closeDrawer();
			location.reload();
			isSuppliers = false;
		} else {
			const error = await res.json();
			console.error('Error creating manufacturer:', error);
		}
	}

	const filteredSuppliers = $derived(() =>
		suppliers.filter(
			(supplier) =>
				supplier.name.toLowerCase().includes(search.toLowerCase()) ||
				(supplier.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
				(supplier.contactPerson ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	const filteredManufacturers = $derived(() =>
		manufacturers.filter((manufacturer) =>
			manufacturer.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	async function confirmDeletion() {
		if (!supplierIdToDelete) return;
		const formData = new FormData();
		formData.append('id', supplierIdToDelete);

		const res = await fetch('/dashboard/suppliers?/delete', {
			method: 'POST',
			body: formData
		});

		showConfirm = false;

		if (res.ok) {
			suppliers = suppliers.filter((s) => s.id !== supplierIdToDelete);
			supplierIdToDelete = null;
		} else {
			console.error('Failed to delete supplier');
		}
	}

	async function confirmDeletionManufacturer() {
		if (!manufacturerIdToDelete) return;
		const formData = new FormData();
		formData.append('id', manufacturerIdToDelete);

		const res = await fetch('/dashboard/suppliers?/deleteManufacturer', {
			method: 'POST',
			body: formData
		});

		showConfirmManufacturer = false;

		if (res.ok) {
			manufacturers = manufacturers.filter((m) => m.id !== manufacturerIdToDelete);
			manufacturerIdToDelete = null;
		} else {
			console.error('Failed to delete manufacturer');
		}
	}
</script>

<section
	class="min-h-screen w-full"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<!-- SUPPLIERS -->
	{#if isSuppliers}
		<PageHeader title="Suppliers Management" subtitle={totalSuppliers + ' Suppliers'}>
			<div class="flex w-full flex-col items-center gap-4 md:flex-row">
				<div class="w-60 md:flex-[3] lg:flex-[4]">
					<SearchBar bind:search placeholder="Search by name..." extraClasses="w-full" />
				</div>
				<div class="flex w-full items-center justify-end gap-2 md:w-auto">
					<Button
						on:click={() => (isSuppliers = true)}
						variant={isSuppliers ? 'primary' : 'secondary'}
						size="md"
						extraStyles="w-full md:w-auto">Suppliers</Button
					>
					<Button
						on:click={() => (isSuppliers = false)}
						variant={!isSuppliers ? 'primary' : 'secondary'}
						size="md"
						extraStyles="w-full md:w-auto">Manufacturers</Button
					>
					<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
						<span class="hidden md:inline">Add Supplier</span>
					</Button>
				</div>
			</div>
		</PageHeader>

		<!-- TABLE -->
		<Table
			columns={['name', 'email', 'contactPerson', 'website', 'phone']}
			items={filteredSuppliers()}
			onEdit={(item) => openEdit(item)}
			onDelete={(item) => askDelete(item.id, item.name)}
		/>

		<!-- MODAL -->
		{#if isEditing}
			<Modal title="➕ Edit Supplier" onClose={closeEdit}>
				<form method="POST" action="?/update">
					<input type="hidden" name="id" value={editId} />
					<TextInput label="Name" name="name" value={editName} required />
					{#if wrongName}
						<p class="pt-2 text-sm text-red-500">Name can not be the same as another supplier</p>
					{/if}
					<TextInput label="Email" name="email" value={editEmail} />
					<TextInput label="Contact Person" name="contactPerson" value={editContactPerson} />
					<TextInput label="Website" name="website" value={editWebsite} />
					<TextInput label="Phone" name="phone" value={editPhone} />
					<TextArea label="Notes" name="notes" value={editNotes} />
					<div class="mt-6 flex justify-end gap-4">
						<Button
							onclick={cancelDeletion}
							variant="secondary"
							size="md"
							extraStyles="w-full md:w-auto"
						>
							{@html '<span class="hidden md:inline">Cancel</span>'}
						</Button>
						<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
							{@html '<span class="hidden md:inline">Update Supplier</span>'}
						</Button>
					</div>
				</form>
			</Modal>
		{/if}

		<!-- DRAWER -->
		<Drawer title="➕ Add New Supplier" onClose={closeDrawer} show={showDrawer}>
			<form onsubmit={handleCreate} class="flex flex-col gap-4">
				<div>
					<label class="font-semibold">Name</label>
					<TextInput name="name" placeholder="Enter supplier name" extraStyles="w-full" required />
					{#if wrongName}
						<p class="pt-2 text-sm text-red-500">Name can not be the same as another supplier</p>
					{/if}
				</div>

				<div>
					<label class="font-semibold">Email</label>
					<TextInput
						name="email"
						placeholder="Enter supplier email"
						type="email"
						extraStyles="w-full"
					/>
				</div>

				<div>
					<label class="font-semibold">Contact Person</label>
					<TextInput
						name="contactPerson"
						placeholder="Enter contact person name"
						extraStyles="w-full"
					/>
				</div>

				<div>
					<label class="font-semibold">Website</label>
					<TextInput name="website" placeholder="Enter website" type="url" extraStyles="w-full" />
				</div>

				<div>
					<label class="font-semibold">Phone</label>
					<TextInput name="phone" placeholder="Enter phone" type="tel" extraStyles="w-full" />
				</div>

				<div>
					<label class="font-semibold">Notes</label>
					<TextArea name="notes" placeholder="Enter notes" extraStyles="w-full" />
				</div>

				<div class="mt-4 flex justify-end gap-4">
					<Button
						type="button"
						variant="secondary"
						size="md"
						class="rounded-md bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400"
						onclick={closeDrawer}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="md"
						class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
					>
						Create Supplier
					</Button>
				</div>
			</form>
		</Drawer>

		<ConfirmDialog
			show={showConfirm}
			message={`Are you sure you want to delete supplier: ${supplierToDelete}?`}
			onConfirm={confirmDeletion}
			onCancel={cancelDeletion}
		/>
	{:else}
		<!-- MANUFACTURERS -->

		<PageHeader title="Manufacturers Management" subtitle={totalManufacturers + ' Manufacturers'}>
			<div class="flex w-full flex-col items-center gap-4 md:flex-row">
				<div class="w-60 md:flex-[3] lg:flex-[4]">
					<SearchBar bind:search placeholder="Search by name..." extraClasses="w-full" />
				</div>
				<div class="flex w-full items-center justify-end gap-2 md:w-auto">
					<Button
						onclick={() => (isSuppliers = true)}
						variant={isSuppliers ? 'primary' : 'secondary'}
						size="md"
						extraStyles="w-full md:w-auto">Suppliers</Button
					>
					<Button
						onclick={() => (isSuppliers = false)}
						variant={!isSuppliers ? 'primary' : 'secondary'}
						size="md"
						extraStyles="w-full md:w-auto">Manufacturers</Button
					>
					<Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
						<span class="hidden md:inline">Add Manufacturer</span>
					</Button>
				</div>
			</div>
		</PageHeader>

		<!-- TABLE -->
		<Table
			columns={['name', 'description']}
			items={filteredManufacturers()}
			onEdit={(item) => openEditManufacturer(item)}
			onDelete={(item) => askDeleteManufacturer(item.id, item.name)}
		/>

		<!-- MODAL -->
		{#if isEditingManufacturer}
			<Modal title="Edit Manufacturer" onClose={closeEditManufacturer}>
				<form method="POST" action="?/updateManufacturer">
					<input type="hidden" name="id" value={editIdManufacturer} />
					<TextInput label="Name" name="name" value={editNameManufacturer} required />
					{#if wrongNameManufacturer}
						<p class="pt-2 text-sm text-red-500">
							Name can not be the same as another manufacturer
						</p>
					{/if}
					<TextArea label="Description" name="description" value={editDescriptionManufacturer} />
					<div class="mt-6 flex justify-end gap-4">
						<Button
							onclick={cancelDeletionManufacturer}
							variant="secondary"
							size="md"
							extraStyles="w-full md:w-auto"
						>
							{@html '<span class="hidden md:inline">Cancel</span>'}
						</Button>
						<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
							{@html '<span class="hidden md:inline">Update Manufacturer</span>'}
						</Button>
					</div>
				</form>
			</Modal>
		{/if}

		<!-- DRAWER -->
		<Drawer title="Add New Manufacturer" onClose={closeDrawer} show={showDrawer}>
			<form onsubmit={handleCreateManufacturer} class="flex flex-col gap-4">
				<div>
					<label class="font-semibold">Name</label>
					<TextInput
						name="name"
						placeholder="Enter manufacturer name"
						extraStyles="w-full"
						required
					/>
					{#if wrongNameManufacturer}
						<p class="pt-2 text-sm text-red-500">
							Name can not be the same as another manufacturer
						</p>
					{/if}
				</div>

				<div>
					<label class="font-semibold">Description</label>
					<TextArea
						name="description"
						placeholder="Enter manufacturer description"
						extraStyles="w-full"
					/>
				</div>

				<div class="mt-4 flex justify-end gap-4">
					<Button
						type="button"
						variant="secondary"
						size="md"
						class="rounded-md bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400"
						onclick={closeDrawer}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="md"
						class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
					>
						Create Manufacturer
					</Button>
				</div>
			</form>
		</Drawer>

		<ConfirmDialog
			show={showConfirmManufacturer}
			message={`Are you sure you want to delete manufacturer: ${manufacturerToDelete}?`}
			onConfirm={confirmDeletionManufacturer}
			onCancel={cancelDeletionManufacturer}
		/>
	{/if}
</section>
