<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let showDrawer = false;

	function goToDetails(id: number) {
		goto(`/dashboard/inventory/${id}`);
	}

	function openDrawer() {
		showDrawer = true;
	}

	function closeDrawer() {
		showDrawer = false;
	}

	function createProduct() {
		alert('Product created (fake action for now).');
		closeDrawer();
	}
</script>

<section class="min-h-screen w-full bg-white p-8">
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
            <button
				class="rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
				on:click={openDrawer}
			>
				- Delete User
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
				{#each data.items as item}
					<tr
						class="cursor-pointer border-t hover:bg-gray-50"
						on:click={() => goToDetails(item.id)}
					>
						<td class="p-3 whitespace-nowrap">{item.code}</td>
						<td class="p-3 whitespace-nowrap">{item.name}</td>
						<td class="p-3 whitespace-nowrap">{item.category}</td>
						<td class="p-3 whitespace-nowrap">
							<span class={item.quantity < 25 ? 'font-bold text-red-500' : ''}>
								{item.quantity} units
							</span>
						</td>
						<td class="p-3 whitespace-nowrap">{item.supplier}</td>
						<td class="p-3 whitespace-nowrap">{item.location}</td>
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
			<h2 class="mb-4 text-2xl font-bold">Create New Item</h2>

			<form class="flex flex-col gap-4" on:submit|preventDefault={createProduct}>
				<div>
					<label class="font-semibold">Product Name</label>
					<input
						type="text"
						placeholder="Enter product name"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">SKU (Code)</label>
					<input
						type="text"
						placeholder="Enter SKU code"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">Category</label>
					<select class="w-full rounded-md border border-gray-300 p-2">
						<option>Raw Material</option>
						<option>Machinery</option>
						<option>Consumables</option>
					</select>
				</div>

				<div class="flex gap-4">
					<div class="w-1/2">
						<label class="font-semibold">Stock</label>
						<input
							type="number"
							placeholder="Stock quantity"
							class="w-full rounded-md border border-gray-300 p-2"
						/>
					</div>
					<div class="w-1/2">
						<label class="font-semibold">Price (€)</label>
						<input
							type="number"
							placeholder="Price"
							class="w-full rounded-md border border-gray-300 p-2"
						/>
					</div>
				</div>

				<div>
					<label class="font-semibold">Supplier</label>
					<input
						type="text"
						placeholder="Supplier name"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">Location</label>
					<input
						type="text"
						placeholder="Warehouse location"
						class="w-full rounded-md border border-gray-300 p-2"
					/>
				</div>

				<div>
					<label class="font-semibold">Description</label>
					<textarea
						placeholder="Product description..."
						class="w-full rounded-md border border-gray-300 p-2"
					></textarea>
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
