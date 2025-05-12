<script lang="ts">
    import { goto } from '$app/navigation';
    import EntityList from '$lib/components/EntityList.svelte';
  
    export let data;
  
    function goToSection(sectionId: number) {
      goto(`/dashboard/stores/${data.store.id}/${sectionId}`);
    }
  </script>
   <div class="p-8 bg-white w-full space-y-1">
    <p class="text-sm text-gray-500">
      <a href="/dashboard/stores" class="text-blue-600 hover:underline">Stores</a>
      / {data.store.name}
    </p>
     </div>

    <EntityList
      title={`Sections in ${data.store.name}`}
      columns={['Name', 'Description']}
      items={data.sections.map(section => ({
        id: section.id,
        name: section.name,
        description: section.description || '-'
      }))}
      searchPlaceholder="Search sections"
      onRowClick={goToSection}
    >

      <div slot="drawerContent" let:closeDrawer>
        <h2 class="text-2xl font-bold mb-4">Create New Section</h2>
        <form method="POST" action="?/createSection" on:submit={() => closeDrawer()} class="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Section Name"
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

  