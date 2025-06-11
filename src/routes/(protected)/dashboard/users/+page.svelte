<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Table from '$lib/components/utilities/table/Table.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	let search = $state('');
	let users = $state([...data.users]);
	let totalUsers = $derived(() => users.length);

	function goToDetails(item: string) {
		goto(`/dashboard/users/${item.id}`);
	}

	const filteredUsers = $derived(() =>
		users.filter(
			(user) =>
				user.username.toLowerCase().includes(search.toLowerCase()) ||
				(user.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
				(user.role ?? '').toLowerCase().includes(search.toLowerCase())
		)
	);
</script>

<section
	class="min-h-screen w-full p-8"
	style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<!-- HEADER & SEARCHBAR -->
	<Header title="Users" subtitle={totalUsers().toString() + ' users'} />

	<div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
		<div class="w-full md:flex-1">
			<SearchBar bind:search placeholder="Search by name, role..." />
		</div>
	</div>

	<!-- TABLE -->
	<Table
		columns={['username', 'email', 'role', 'lastLogin']}
		items={filteredUsers()}
		onRowClick={(item) => goToDetails(item)}
		ifEdit={() => false}
		ifDelete={() => false}
	/>
</section>
