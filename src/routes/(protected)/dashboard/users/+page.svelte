<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';

	const { data } = $props();

	let showDrawer = $state(false);
	let wrongPassword = $state(false);
	let search = $state('');
	let users = $state([...data.users]);
	let roles = $state([...data.roles]);
	let totalUsers = $derived(() => users.length);

	function goToDetails(id: string) {
		goto(`/dashboard/users/${id}`);
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function checkPassword() {
		const password = document.getElementById('password') as HTMLInputElement;
		const passwordRepeat = document.getElementById('password-repeat') as HTMLInputElement;

		if (password.value !== passwordRepeat.value) {
			wrongPassword = true;
			return false;
		}
		return true;
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

		const res = await fetch('/dashboard/users?/delete', {
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
	<Header title="Users" totalCount={totalUsers()} countLabel="users" />

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar {search} placeholder="Search by name, role..." />
		</div>
		<div class="-mt-6 flex w-full justify-end md:w-auto">
			<Button
				type="button"
				variant="primary"
				size="md"
				extraStyles="font-semibold text-sm rounded-md shadow transition hover:brightness-95 hover:shadow-lg"
				onclick={openDrawer}
			>
				+ Add User
			</Button>
		</div>
	</div>
	<!-- TABLE -->
	<Table
		columns={['username', 'email', 'role', 'lastLogin']}
		items={filteredUsers()}
		on:rowClick={(e) => goToDetails(e.detail)}
		on:delete={(e) => handleDelete(e.detail.id)}
	/>

	<!-- DRAWER -->
	{#if showDrawer}
		<Drawer title="Add New User" onClose={closeDrawer}>
			<h2 class="mb-4 text-2xl font-bold">Add New User</h2>
			<form
				method="POST"
				action="?/create"
				class="flex flex-col gap-4"
				onsubmit={(e) => {
					e.preventDefault();
					if (checkPassword()) {
						(e.target as HTMLFormElement).requestSubmit();
					}
				}}
			>
				<div>
					<label class="font-semibold">Username</label>
					<input
						type="text"
						placeholder="New user username"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">Full Name</label>
					<input
						type="text"
						placeholder="New user full name"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">Email</label>
					<input
						type="text"
						placeholder="New user email"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold"
						>Password <span class="text-indigo-500 underline underline-offset-1"
							>User will change it on login</span
						></label
					>
					<input
						type="text"
						placeholder="New user password"
						class={wrongPassword
							? 'w-full rounded-md border border-3 border-red-300 p-2'
							: 'w-full rounded-md border border-gray-300 p-2'}
						id="password"
					/>
				</div>

				<div>
					<label class="font-semibold">Repeat Password</label>
					<input
						type="text"
						placeholder="Repeat new user password"
						class={wrongPassword
							? 'w-full rounded-md border border-3 border-red-300 p-2'
							: 'w-full rounded-md border border-gray-300 p-2'}
						id="password-repeat"
					/>
				</div>

				<div>
					<label class="font-semibold">Role</label>
					<select
						name="rol"
						id="rol"
						class="w-full rounded-xl border border-gray-300 bg-white p-3 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
						required
					>
						<option disabled selected>Choose a role...</option>
						{#each roles as role}
							<option value={role.id}>{role.name}</option>
						{/each}
					</select>
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
					<!--<Button type="submit" variant="primary" size="md">Create</Button>-->
					<button
						type="submit"
						class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
					>
						Create
					</button>
				</div>
			</form>
		</Drawer>
	{/if}
</section>
