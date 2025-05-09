<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let showDrawer = false;

	let wrongPassword = false;

	function goToDetails(id: number) {
		goto(`/dashboard/users/${id}`);
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function createUser() {
		alert('User created (fake action for now).');
		closeDrawer();
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
</script>

<section
	class="min-h-screen w-full p-8"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
>
	<!-- HEADER & ACTIONS -->
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<!-- Title -->
		<h1 class="text-2xl font-bold">Inventory</h1>
	</div>

	<!-- SEARCH BAR -->
	<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

			<input
				type="text"
				placeholder="Search by name, role..."
				class="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2"
			/>

			<button class="rounded-md bg-green-400 px-4 py-2 font-semibold hover:bg-green-500">
				Search
			</button>

		<div>
			<button
				class="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
			>
				Filter
			</button>
			<button
				class="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
				on:click={openDrawer}
			>
				+ Add User
			</button>
		</div>
	</div>

	<!-- TABLE -->
	<div class="overflow-x-auto">
		<table class="w-full table-auto border border-gray-300 text-sm">
			<thead class="bg-gray-100 text-gray-700">
				<tr>
					<th class="p-3 text-left font-semibold">#</th>
					<th class="p-3 text-left font-semibold">Username</th>
					<th class="p-3 text-left font-semibold">Full name</th>
					<th class="p-3 text-left font-semibold">Email</th>
					<th class="p-3 text-left font-semibold">Role</th>
					<th class="p-3 text-left font-semibold">Last login</th>
					<th class="p-3 text-center font-semibold">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr
						class="cursor-pointer border-t hover:bg-gray-50"
						on:click={() => goToDetails(user.id)}
					>
						<td class="p-3 whitespace-nowrap">{user.id}</td>
						<td class="p-3 whitespace-nowrap">{user.username}</td>
						<td class="p-3 whitespace-nowrap">{user.fullName}</td>
						<td class="p-3 whitespace-nowrap">{user.email}</td>
						<td class="p-3 whitespace-nowrap">{user.role}</td>
						<td class="p-3 whitespace-nowrap">{user.lastLogin}</td>
						<td class="flex justify-center gap-3 p-3" on:click|stopPropagation>
							<button class="text-blue-600 hover:text-blue-800">✏️</button>
							<button class="text-red-600 hover:text-red-800">🗑️</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- DRAWER -->
	{#if showDrawer}
		<div class="fixed inset-0 z-40 bg-black/30" on:click={closeDrawer}></div>
		<div
			class="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto bg-white p-8 shadow-2xl"
		>
			<h2 class="mb-4 text-2xl font-bold">Add New User</h2>

			<form
				class="flex flex-col gap-4"
				on:submit|preventDefault={(e) => {
					if (checkPassword()) {
						createUser();
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

				<!-- Añadir ocultar contraseña -->
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

				<div class="mt-4 flex justify-end gap-4">
					<button
						type="button"
						on:click={closeDrawer}
						class="rounded-md bg-gray-300 px-6 py-2 font-semibold text-gray-800 hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
					>
						Create
					</button>
				</div>
			</form>
		</div>
	{/if}
</section>
