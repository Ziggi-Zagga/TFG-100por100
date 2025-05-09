<script lang="ts">
    import EntityList from '$lib/components/EntityList.svelte';
    import { goto } from '$app/navigation';
  
    export let data;
  
    function goToStoreDetails(id: number) {
      goto(`/dashboard/stores/${id}`);
    }
  </script>
  
  <EntityList
    title="Stores Management"
    columns={['Name', 'Location']}
    items={data.stores.map((store: any) => ({
      id: store.id,
      name: store.name,
      location: store.location
    }))}
    searchPlaceholder="Search by name or location"
    onRowClick={goToStoreDetails}
  >
    <div slot="drawerContent" let:closeDrawer>
      <h2 class="text-2xl font-bold mb-4">Create New Store</h2>
      <form method="POST" action="?/create" on:submit={() => closeDrawer()} class="space-y-4">
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
  