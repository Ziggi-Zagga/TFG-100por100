<script lang="ts">
    import { goto } from '$app/navigation';
    import EntityList from '$lib/components/EntityList.svelte';
  
    export let data;
  
    function goToGap(gapId: number) {
      goto(`/dashboard/stores/${data.store.id}/${data.section.id}/${data.row.id}/${gapId}`);
    }
  </script>
  
  <section class="p-8 bg-white w-full min-h-screen space-y-6">
    <p class="text-sm text-gray-500">
      <a href="/dashboard/stores" class="text-blue-600 hover:underline">Stores</a>
      / <a href={`/dashboard/stores/${data.store.id}`} class="text-blue-600 hover:underline">{data.store.name}</a>
      / <a href={`/dashboard/stores/${data.store.id}/${data.section.id}`} class="text-blue-600 hover:underline">{data.section.name}</a>
      / {data.row.name}
    </p>
  
    <EntityList
      title={`Gaps in ${data.row.name}`}
      columns={['Name', 'Capacity', 'Notes']}
      items={data.gaps.map(gap => ({
        id: gap.id,
        name: gap.name,
        capacity: gap.capacity ?? '-',
        notes: gap.notes ?? '-'
      }))}
      searchPlaceholder="Search gaps"
      onRowClick={goToGap}
    >
      <div slot="drawerContent" let:closeDrawer>
        <h2 class="text-2xl font-bold mb-4">Create New Gap</h2>
        <form method="POST" action="?/createGap" on:submit={() => closeDrawer()} class="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Gap Name"
            required
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
          <textarea
            name="notes"
            placeholder="Notes"
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
  