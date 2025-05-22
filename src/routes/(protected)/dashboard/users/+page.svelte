<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
	import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
	import Select from '$lib/components/utilities/Form/Select.svelte';

	const { data } = $props();

	let showDrawer = $state(false);
	let search = $state('');
	let users = $state([...data.users]);
	let roles = $state([...data.roles]);
	let totalUsers = $derived(() => users.length);

	function goToDetails(item: string) {
		goto(`/dashboard/users/${item.id}`);
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	const filteredUsers = $derived(() =>
		users.filter(
			(user) =>
				user.username.toLowerCase().includes(search.toLowerCase()) ||
				(user.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
				(user.role ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);

	async function handleDelete(userId: string) {
		const formData = new FormData();
		formData.append('id', userId);

		const res = await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			users = users.filter((s) => s.id !== userId);
		} else {
			console.error('Failed to delete user');
		}
	}
</script>

<section
	class="min-h-screen w-full p-8"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
>
	<!-- HEADER & SEARCHBAR -->
	<Header title="Users" subtitle={totalUsers().toString() + ' users'} />

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search={search} placeholder="Search by name, role..." />
		</div>
	</div>

	<!-- TABLE -->
	<Table
		columns={['username', 'email', 'role', 'lastLogin']}
		items={filteredUsers()}
		onRowClick={(item) => goToDetails(item)}
		onDelete={(item) => handleDelete(item.id)}
	/>

	<!-- DRAWER -->
	{#if showDrawer}
		<Drawer title="Add New Role" onClose={closeDrawer}>
			<h2 class="mb-4 text-2xl font-bold">Add New Role</h2>
			<form
				method="POST"
				use:enhance
				action="?/createRole"
				class="flex flex-col gap-4"
			>
				<div>
					<label class="font-semibold">Role Name</label>
					<TextInput name="role_name" placeholder="Enter role name" extraStyles="w-full" />
				</div>

				<div>
					<label class="font-semibold">Description</label>
					<TextInput name="role_description" placeholder="Enter role description" extraStyles="w-full" />
				</div>

				<div>
					<label class="font-semibold">Permissions</label>
					<Select
						name="permissions"
						placeholder="Select permissions"
						options={[
							{id:"full", name:"Full"},
							{id:"limited", name:"Limited"},
						]}
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
						Create Role
					</Button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
