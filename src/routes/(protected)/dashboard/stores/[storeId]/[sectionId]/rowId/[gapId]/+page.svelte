<script lang="ts">
    import EntityList from '$lib/components/EntityList.svelte';
  
    export let data;
  </script>
  
  <section class="p-8 bg-white w-full min-h-screen space-y-6">
    <p class="text-sm text-gray-500">
      <a href="/dashboard/stores" class="text-blue-600 hover:underline">Stores</a>
      / <a href={`/dashboard/stores/${data.store.id}`} class="text-blue-600 hover:underline">{data.store.name}</a>
      / <a href={`/dashboard/stores/${data.store.id}/${data.section.id}`} class="text-blue-600 hover:underline">{data.section.name}</a>
      / <a href={`/dashboard/stores/${data.store.id}/${data.section.id}/${data.row.id}`} class="text-blue-600 hover:underline">{data.row.name}</a>
      / {data.gap.name}
    </p>
  
    <EntityList
      title={`Objects in ${data.gap.name}`}
      columns={['Name', 'Type', 'Quantity']}
      items={data.objects.map(obj => ({
        id: obj.id,
        name: obj.name,
        type: obj.type ?? '-',
        quantity: obj.quantity ?? '-'
      }))}
      searchPlaceholder="Search objects"
      onRowClick={() => { /* No navega más abajo */ }}
    >
      <div slot="drawerContent" let:closeDrawer>
        <h2 class="text-2xl font-bold mb-4">Add Object to {data.gap.name}</h2>
        <form method="POST" action="?/createObject" on:submit={() => closeDrawer()} class="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Object Name"
            required
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            class="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
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
  