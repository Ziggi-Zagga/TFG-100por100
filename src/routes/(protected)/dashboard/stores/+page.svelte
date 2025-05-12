<script lang="ts">
  import { enhance } from '$app/forms';
  import EntityList from '$lib/components/EntityList.svelte';
  import EntityListHeader from '$lib/components/EntityListHeader.svelte';
  import EntityListSearchBar from '$lib/components/EntityListSearchBar.svelte';
  import { goto } from '$app/navigation';

  export let data;

  let search = '';
  let showDrawer = false;

  let storesList = [...data.stores];

  $: filteredStores = storesList.filter((store: any) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    (store.location ?? '').toLowerCase().includes(search.toLowerCase())
  );

  function openDrawer() {
    showDrawer = true;
  }

  function closeDrawer() {
    showDrawer = false;
  }

  function goToStoreDetails(id: string) {
    goto(`/dashboard/stores/${id}`);
  }
</script>

<section class=" w-full min-h-screen" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
  <EntityList
    title="Stores Management"
    columns={['Name', 'Location']}
    items={filteredStores.map((store: any) => ({
      id: store.id,
      name: store.name,
      location: store.location
    }))}
    searchPlaceholder="Search by name or location"
    onRowClick={goToStoreDetails}
    {showDrawer}
    onCloseDrawer={closeDrawer}
  >
    <div slot="drawerContent" let:closeDrawer>
      <h2 class="text-2xl font-bold mb-4">Create New Store</h2>
      <form
        method="POST"
        action="?/create"
        use:enhance={{
          result: async (res, form) => {
            if (res.type === 'success') {
              const fd = new FormData(form);
              storesList = [
                ...storesList,
                {
                  id: res.data?.id ?? crypto.randomUUID(), 
                  name: fd.get('name')?.toString() ?? '',
                  location: fd.get('location')?.toString() ?? ''
                }
              ];
              closeDrawer();
            }
          }
        }}
        class="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          required
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          class="w-full p-2 border border-gray-300 rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          class="w-full p-2 border border-gray-300 rounded-lg"
        ></textarea>
        <div class="flex justify-end gap-4">
          <button
            type="submit"
            class="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </EntityList>
</section>
