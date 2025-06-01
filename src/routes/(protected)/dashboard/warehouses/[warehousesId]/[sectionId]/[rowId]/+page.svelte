<script lang="ts">
  import PageHeader from '$lib/components/utilities/Header/Header.svelte';
  import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
  import Table from '$lib/components/utilities/table/Table.svelte';
  import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
  import Breadcrumb from '$lib/components/utilities/Breadcrumb.svelte';
  import Button from '$lib/components/utilities/Button/Button.svelte';
  import { goto } from '$app/navigation';

  const { data } = $props();
  let gaps = $state([...data.gaps]);
  let showDrawer = $state(false);
  let search = $state('');

  const filteredGaps = $derived(() =>
    gaps.filter((gap) => gap.name.toLowerCase().includes(search.toLowerCase()))
  );

  function openDrawer() {
    showDrawer = true;
  }

  function closeDrawer() {
    showDrawer = false;
  }
  	function goToGap(gapId: string) {
		goto(`/dashboard/warehouse/${data.warehouse.id}/${data.section.id}/${data.row.id}/${gapId}`);
	}

  async function handleDelete(gapId: string) {
    const formData = new FormData();
    formData.append('id', gapId);
    const res = await fetch('?/delete', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      gaps = gaps.filter((g) => g.id !== gapId);
    } else {
      console.error('Failed to delete gap');
    }
  }
</script>

<section class="p-8 w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  <PageHeader title={data.row.name} subtitle={`${gaps.length} gaps`}>
    <div class="flex items-center gap-4">
      <Breadcrumb segments={[
        { name: 'warehouse', href: '/dashboard/warehouse' },
        { name: data.warehouse.name, href: `/dashboard/warehouse/${data.warehouse.id}` },
        { name: data.section.name, href: `/dashboard/warehouse/${data.warehouse.id}/${data.section.id}` },
        { name: data.row.name }
      ]} />
    </div>
  </PageHeader>

  <div class="mb-1 flex flex-col items-center gap-4 md:flex-row">
    <div class="w-full md:flex-1">
      <SearchBar bind:search placeholder="Search gaps..." />
    </div>
    <div class="-mt-6 flex w-full justify-end md:w-auto">
      <Button onclick={openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
        {@html '<span class="hidden md:inline">Add Gap</span>'}
      </Button>
    </div>
  </div>

  <Table
  columns={["name", "capacity"]}
  items={filteredGaps()}
  onRowClick={(item) => goToGap(item.id)}
  onDelete={(item) => handleDelete(item.id)}
/>

  {#if showDrawer}
    <Drawer title="➕ Create New Gap" onClose={closeDrawer}>
      <form
        method="POST"
        action="?/create"
        class="fixed top-0 right-0 w-full max-w-3xl h-full bg-white shadow-2xl p-10 rounded-l-3xl overflow-y-auto z-50 border-l border-blue-100 space-y-4"
      >
        <h2 class="text-3xl font-bold text-blue-800 mb-8">➕ Create New Gap</h2>

        <input name="name" required placeholder="Gap Name" class="w-full p-3 border border-gray-300 rounded-xl" />
        <input name="capacity" type="number" placeholder="Capacity" class="w-full p-3 border border-gray-300 rounded-xl" />
        <textarea name="notes" placeholder="Notes" class="w-full p-3 border border-gray-300 rounded-xl"></textarea>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" onclick={closeDrawer} class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-xl shadow-sm">
            Cancel
          </button>
          <button type="submit" class="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md">
            Create
          </button>
        </div>
      </form>
    </Drawer>
  {/if}
</section>
