<script lang="ts">
    import { goto } from '$app/navigation';
    import EntityList from '$lib/components/EntityList.svelte';
  
    export let data;
  
    function goToRow(rowId: number) {
      goto(`/dashboard/stores/${data.store.id}/${data.section.id}/${rowId}`);
    }
  </script>
  
  <section class="p-8 bg-white w-full min-h-screen space-y-6">
    <p class="text-sm text-gray-500">
      <a href="/dashboard/stores" class="text-blue-600 hover:underline">Stores</a>
      / <a href={`/dashboard/stores/${data.store.id}`} class="text-blue-600 hover:underline">{data.store.name}</a>
      / {data.section.name}
    </p>
  
    <EntityList
      title={`Rows in ${data.section.name}`}
      columns={['Name']}
      items={data.rows.map(row => ({
        id: row.id,
        name: row.name
      }))}
      searchPlaceholder="Search rows"
      onRowClick={goToRow}
    >
      <div slot="drawerContent" let:closeDrawer>
        <h2 class="text-2xl font-bold mb-4">Create New Row</h2>
        <form method="POST" action="?/createRow" on:submit={() => closeDrawer()} class="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Row Name"
            required
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
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
  