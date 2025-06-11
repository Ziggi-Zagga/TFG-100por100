<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import ShowText from '$lib/components/utilities/ShowText/ShowText.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/utilities/Modal/Modal.svelte';
	import Icon from '$lib/components/utilities/Icons/Icon.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const { data } = $props<PageData>();
	let selectedOption = $state<'orders' | 'inventory'>('orders');
	const historyOptions = [
		{ id: 'orders', name: 'Orders' },
		{ id: 'inventory', name: 'Inventory' }
	];
	let id = $state(get(page).params.id);
	let user = data.user;
	let isEditing = $state(false);
	let roles = $state([...data.roles]);
	let showConfirm = $state(false);

	onMount(() => {
		id = get(page).params.id;
		const urlParams = new URLSearchParams(get(page).url.search);
		if (urlParams.get('edit') === 'true') {
			isEditing = true;
		}
	});

	function toggleEdit() {
		isEditing = !isEditing;
	}

	async function confirmDeletion() {
		const formData = new FormData();
		formData.append('id', id);

		const res = await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		showConfirm = false;

		if (res.ok) {
			goto('/dashboard/users');
		} else {
			console.error('Failed to delete user');
		}
	}

	function handleDelete() {
		showConfirm = true;
	}

	function cancelDeletion() {
		showConfirm = false;
	}

	function closeDrawer() {
		isEditing = false;
	}

	function handleRoleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const selectedRole = target.value;
		// Handle role change logic here
	}
</script>

<section
	class="flex min-h-screen justify-center px-4 pt-0 pb-4 md:px-8 md:pb-8"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<div
		class="w-full max-w-7xl space-y-12 rounded-2xl bg-white px-6 py-6 shadow-xl md:px-10 md:py-8"
	>
		<div class="flex items-center justify-between">
			<button
				onclick={() => goto('/dashboard/users')}
				class="text-2xl text-indigo-600 hover:text-indigo-800"
			>
				←
			</button>
			<div class="flex gap-4">
				<button
					onclick={toggleEdit}
					class="text-2xl text-yellow-500 transition hover:scale-110 hover:text-yellow-600"
				>
					{#if isEditing}
						<Icon icon="close" size={30} />
					{:else}
						<Icon icon="edit" size={30} />
					{/if}
				</button>
				<button
					onclick={handleDelete}
					class="text-2xl text-red-500 transition hover:scale-110 hover:text-red-600"
				>
					<Icon icon="delete" size={30} />
				</button>
			</div>
		</div>

		<div class="flex flex-col gap-12 md:flex-row">
			<div class="flex w-full justify-center md:w-1/3">
				<div
					class="hidden overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 p-12 shadow-md md:block"
				>
					<!-- Atribuir imagen de usuario -->
					<!-- <a href="https://www.freepik.es/icono/usuario_7945130#fromView=search&page=1&position=8&uuid=6165784a-4191-45e9-a686-fe87b81b772e">Icono de adrianadam</a> -->
					<img
						src="/icons/png/userIcon.png"
						alt="User Avatar"
						class="w-full rounded-lg object-cover"
					/>
				</div>
			</div>

			<div class="flex w-full flex-col gap-6 md:w-2/3">
				{#if isEditing}
					<Modal title="Edit User" onClose={closeDrawer}>
						<form
							method="POST"
							action="?/update"
							class="space-y-6 rounded-xl bg-gray-50 p-6 shadow-md"
						>
							<input type="hidden" name="id" value={id} />
							<TextInput
								label="Username"
								name="username"
								placeholder="Enter username"
								value={user.username}
								required
							/>
							<TextInput
								label="Email"
								name="email"
								type="email"
								placeholder="Enter email"
								value={user.email}
								required
							/>
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<Select
									label="Role"
									name="role"
									options={roles}
									value={user.roleId}
									onValueChange={(val) => handleRoleChange(val)}
								/>
							</div>

							<div class="mt-6 flex justify-end gap-4">
								<Button
									onclick={closeDrawer}
									variant="secondary"
									size="md"
									extraStyles="w-full md:w-auto"
								>
									{@html '<span class="hidden md:inline">Cancel</span>'}
								</Button>
								<Button type="submit" variant="primary" size="md" extraStyles="w-full md:w-auto">
									{@html '<span class="hidden md:inline">Save</span>'}
								</Button>
							</div>
						</form>
					</Modal>
				{/if}

				<h2 class="text-4xl font-bold text-gray-800">{user.username}</h2>
				<p class="text-2xl text-indigo-600">{user.email}</p>

				<ShowText
					label="Role"
					value={roles.find((role) => role.id === user.roleId)?.name || 'Role not found'}
				/>
				<ShowText label="Created At" value={new Date(user.createdAt).toLocaleDateString()} />
			</div>
		</div>

		<Header title="User History" subtitle={user.username}>
			<div class="w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
				<Select
					label="Select History Type"
					name="historyType"
					options={historyOptions}
					value={selectedOption}
					onValueChange={(val) => (selectedOption = val as 'orders' | 'inventory')}
				/>
			</div>
		</Header>

		{#if selectedOption === 'orders'}
			<Table
				columns={['orderNumber', 'supplierName', 'createdAt', 'status']}
				ifEdit={() => false}
				ifDelete={() => false}
				items={data.orders}
				onRowClick={(item) => goto(`/dashboard/orders/ordersList?id=${item.id}`)}
			/>
		{:else if selectedOption === 'inventory'}
			<Table
				columns={[
					'id',
					'productName',
					'fromLocation',
					'toLocation',
					'previousQuantity',
					'newQuantity'
				]}
				ifEdit={() => false}
				ifDelete={() => false}
				items={data.inventoryHistory}
				onRowClick={(item) => goto(`/dashboard/inventory?id=${item.inventoryId}`)}
			/>
		{/if}
	</div>
</section>

<ConfirmDialog
	show={showConfirm}
	message={`Are you sure you want to delete user: ${user.username}?`}
	onConfirm={confirmDeletion}
	onCancel={cancelDeletion}
/>

{#if user}
	<!-- Existing content remains here -->
{:else}
	<p class="mt-8 text-center text-red-500">Error: User not found.</p>
{/if}
