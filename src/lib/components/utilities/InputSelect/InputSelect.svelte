<script lang="ts">
  export let label: string = "";
  export let name: string = "";
  export let options: Array<{ id: string; name: string; }> = [];
  export let selected: string = "";
  export let disabled: boolean = false;
  export let onChange: (e: Event) => void = () => {};
</script>

<div>
  {#if label}
    <label class="block text-sm font-semibold text-gray-600 mb-1" for={name}>
      {label}
    </label>
  {/if}
  <select
    id={name}
    name={name}
    class="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm bg-white"
    bind:value={selected}
    {disabled}
    on:change={onChange}
  >
    <option disabled value=""></option>
    {#each options as option}
      <option value={option.id}>
        {option.name}
      </option>
    {/each}
  </select>
</div>
