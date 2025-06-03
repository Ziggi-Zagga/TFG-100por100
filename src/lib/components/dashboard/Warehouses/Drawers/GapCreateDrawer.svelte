<script lang="ts">
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
  
    export let show: boolean;
    export let onClose: () => void;
    export let onCreate: (formData: FormData) => Promise<void>;
    export let rowId: string | null;
  </script>
  
  <Drawer title="Create New Gap" {show} onClose={onClose}>
    {#if rowId}
      <form
        onsubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          formData.append('rowId', rowId);
          onCreate(formData);
        }}
        class="space-y-4"
      >
        <TextInput
          name="name"
          label="Gap Name"
          placeholder="Enter gap name"
          required
        />
        <TextInput
          name="capacity"
          label="Capacity"
          type="number"
          placeholder="Enter capacity (optional)"
        />
        <TextInput
          name="notes"
          label="Notes"
          placeholder="Enter gap description"
          type="textarea"
        />
        <div class="mt-6 flex justify-end gap-4">
          <Button type="button" variant="secondary" size="md" onclick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Create Gap
          </Button>
        </div>
      </form>
    {/if}
  </Drawer>
  