<script lang="ts">
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
  
    export let show: boolean;
    export let onClose: () => void;
    export let onUpdate: (formData: FormData) => Promise<void>;
    export let warehouse: { id: string; name: string; location: string | null; description: string | null } | null;
  
    function handleSubmit(e: SubmitEvent) {
      e.preventDefault();
      if (!warehouse) return;
  
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      formData.append('id', warehouse.id);
      onUpdate(formData);
    }
  
    function handleCancel() {
      onClose();
    }
  </script>
  
  <Drawer title="Edit Warehouse" {show} onClose={handleCancel}>
    {#if warehouse}
      <form onsubmit={handleSubmit} class="space-y-4">
        <TextInput
          name="name"
          required
          placeholder="Warehouse Name"
          value={warehouse.name || ''}
        />
        <TextInput
          name="location"
          required
          placeholder="Location"
          value={warehouse.location || ''}
        />
        <TextInput
          name="description"
          placeholder="Description"
          value={warehouse.description || ''}
        />
  
        <div class="mt-6 flex justify-end gap-4">
          <Button type="button" variant="secondary" size="md" onclick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </form>
    {/if}
  </Drawer>
  