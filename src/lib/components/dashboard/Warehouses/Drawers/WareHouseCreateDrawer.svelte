<script lang="ts">
    import Drawer from '$lib/components/utilities/Drawer/Drawer.svelte';
    import TextInput from '$lib/components/utilities/Form/TextInput.svelte';
    import Button from '$lib/components/utilities/Button/Button.svelte';
  
    export let show: boolean;
    export let onClose: () => void;
    export let onCreate: (formData: FormData) => Promise<void>;
  
    function handleSubmit(e: SubmitEvent) {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      onCreate(formData);
    }
  
    function handleCancel() {
      onClose();
    }
  </script>
  
  <Drawer title="Create New Warehouse" {show} onClose={handleCancel}>
    <form onsubmit={handleSubmit} class="space-y-4">
      <TextInput name="name" required placeholder="Warehouse Name" />
      <TextInput name="location" required placeholder="Location" />
      <TextInput name="description" placeholder="Description" />
  
      <div class="mt-6 flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onclick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Create
        </Button>
      </div>
    </form>
  </Drawer>
  