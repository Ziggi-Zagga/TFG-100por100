<script lang="ts">
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
  
    export let show: boolean;
    export let onClose: () => void;
    export let onCreate: (formData: FormData) => Promise<void>;
    export let warehouseId: string | null;
  </script>
  
  <Drawer title="Create New Section" {show} onClose={onClose}>
    {#if warehouseId}
      <form
        onsubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          formData.append('warehouseId', warehouseId);
          onCreate(formData);
        }}
        class="space-y-4"
      >
        <TextInput
          name="name"
          label="Section Name"
          placeholder="Enter section name"
          required
        />
        <TextInput
          name="description"
          label="Description"
          placeholder="Enter section description"
          type="textarea"
        />
        <div class="mt-6 flex justify-end gap-4">
          <Button type="button" variant="secondary" size="md" onclick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Create Section
          </Button>
        </div>
      </form>
    {/if}
  </Drawer>
  