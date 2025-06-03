<script lang="ts">
	import PageHeader from '$lib/components/utilities/Header/Header.svelte';
	import SearchBar from '$lib/components/utilities/SearchBar/SearchBar.svelte';
	import Button from '$lib/components/utilities/Button/Button.svelte';
	import ConfirmDialog from '$lib/components/utilities/ConfirmDialog/ConfirmDialog.svelte';
	import ToastList from '$lib/components/utilities/Toast/ToastList.svelte';
	import CircleNavigation from '$lib/components/dashboard/Warehouses/CircleNavigation.svelte';
  
	import WarehouseView from '$lib/components/dashboard/Warehouses/views/WarehousesView.svelte';
	import SectionsView from '$lib/components/dashboard/Warehouses/views/SectionsView.svelte';
	import RowsView from '$lib/components/dashboard/Warehouses/views/RowsView.svelte';
	import GapsView from '$lib/components/dashboard/Warehouses/views/GapsView.svelte';
  
	import WarehouseCreateDrawer from '$lib/components/dashboard/Warehouses/drawers/WarehouseCreateDrawer.svelte';
	import WarehouseEditDrawer from '$lib/components/dashboard/Warehouses/drawers/WarehouseEditDrawer.svelte';
	import SectionCreateDrawer from '$lib/components/dashboard/Warehouses/drawers/SectionCreateDrawer.svelte';
	import RowCreateDrawer from '$lib/components/dashboard/Warehouses/drawers/RowCreateDrawer.svelte';
	import GapCreateDrawer from '$lib/components/dashboard/Warehouses/drawers/GapCreateDrawer.svelte';
  
	import { useWarehousePage } from '$lib/hooks/useWarehousePage';
	import type { PageData } from './$types';
  
	const { data } = $props<{ data: PageData }>();
	const state = useWarehousePage(data);
  </script>
  
  {#if state.showCircleBar}
	<CircleNavigation
	  currentView={state.currentView}
	  search={state.search}
	  getLineWidth={state.getLineWidth}
	  getCircleStyles={state.getCircleStyles}
	  getIconStyles={state.getIconStyles}
	  getCircleClickability={state.getCircleClickability}
	  getCircleTitle={state.getCircleTitle}
	  getCircleClickHandler={state.getCircleClickHandler}
	  getSearchPlaceholder={state.getSearchPlaceholder}
	  getAddButtonText={state.getAddButtonText}
	  onSearchChange={state.handleSearchChange}
	  onAddClick={state.getAddButtonHandler()}
	/>
  {/if}
  
  <section class="min-h-screen w-full transition-all duration-500 ease-in-out" style="background-image: linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd);">
	{#if state.currentView === 'warehouses'}
	  <div class="page-header transition-all duration-500 ease-in-out" class:opacity-0={state.hideOriginalHeader} class:pointer-events-none={state.hideOriginalHeader}>
		<PageHeader title="Warehouse Management" subtitle={`${state.warehouse.length} warehouse${state.warehouse.length !== 1 ? 's' : ''}`} extraStyles="plain">
		  <div class="flex w-full flex-col items-center gap-4 md:flex-row">
			<div class="w-60 md:flex-[3] lg:flex-[4]">
			  <SearchBar bind:search={state.search} placeholder="Search by name or location..." extraClasses="w-full" />
			</div>
			<div class="flex w-full justify-end md:w-auto">
			  <Button onclick={state.openDrawer} variant="primary" size="md" extraStyles="w-full md:w-auto">
				<span class="hidden md:inline">Add warehouse</span>
			  </Button>
			</div>
		  </div>
		</PageHeader>
	  </div>
	{/if}
  
	<div class="content-container flex flex-col">
	  {#if state.currentView === 'warehouses'}
		<WarehouseView
		  warehouses={state.warehouse}
		  isAnimating={state.isAnimating}
		  fadeWarehouses={state.fadeWarehouses}
		  search={state.search}
		  onWarehouseCardClick={state.handleWarehouseCardClick}
		  onEdit={state.handleEdit}
		  onDelete={(e) => { state.warehouseToDelete = e.detail }}
		/>
	  {:else if state.currentView === 'sections' && state.showSectionsView && state.selectedWarehouse}
		{#if state.isLoadingSections}
		  <div class="flex items-center justify-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
		  </div>
		{:else}
		  <SectionsView
			warehouse={state.selectedWarehouse}
			sections={state.sections.filter(s => s.warehouseId === state.selectedWarehouse?.id)}
			search={state.search}
			isAnimating={state.isAnimating}
			fadeSections={state.fadeSections}
			showSectionDrawer={state.showSectionDrawer}
			onSectionSelected={state.handleSectionSelected}
			onAddSection={state.handleAddSection}
			onCloseSectionDrawer={() => state.showSectionDrawer = false}
			onSearchChange={state.handleSearchChange}
		  />
		{/if}
	  {:else if state.currentView === 'rows' && state.selectedSection}
		<RowsView
		  section={state.selectedSection}
		  rows={state.rows}
		  search={state.search}
		  isAnimating={state.isAnimating}
		  fadeRows={state.fadeSections}
		  showRowDrawer={state.showRowDrawer}
		  onRowSelected={state.handleRowSelected}
		  onSearchChange={state.handleSearchChange}
		  onCloseRowDrawer={() => state.showRowDrawer = false}
		  onAddRow={state.handleAddRow}
		/>
		<Button onclick={state.backToSections} variant="secondary" size="sm" class="mt-4">
		  Back to Sections
		</Button>
	  {:else if state.currentView === 'gaps' && state.selectedRow}
		<GapsView
		  row={state.selectedRow}
		  gaps={state.gaps}
		  search={state.search}
		  isAnimating={state.isAnimating}
		  fadeGaps={state.fadeSections}
		  showGapDrawer={state.showGapDrawer}
		  onSearchChange={state.handleSearchChange}
		  onGapSelected={state.handleGapSelected}
		  onCloseGapDrawer={() => state.showGapDrawer = false}
		  onAddGap={state.handleAddGap}
		/>
		<Button onclick={state.backToRows} variant="secondary" size="sm" class="mt-4">
		  Back to Rows
		</Button>
	  {/if}
	</div>
  </section>
  
  <WarehouseCreateDrawer show={state.showDrawer} onClose={state.closeDrawer} onCreate={state.handleCreateWarehouse} />
  <WarehouseEditDrawer show={state.showEditDrawer} onClose={state.closeEditDrawer} onUpdate={state.handleUpdateWarehouse} warehouse={state.editingwarehouse} />
  <SectionCreateDrawer show={state.showSectionDrawer} onClose={() => state.showSectionDrawer = false} onCreate={state.handleAddSection} warehouseId={state.selectedWarehouse?.id} />
  <RowCreateDrawer show={state.showRowDrawer} onClose={() => state.showRowDrawer = false} onCreate={state.handleAddRow} sectionId={state.selectedSection?.id} />
  <GapCreateDrawer show={state.showGapDrawer} onClose={() => state.showGapDrawer = false} onCreate={state.handleAddGap} rowId={state.selectedRow?.id} />
  
  <ConfirmDialog
	show={state.showDeleteDialog}
	message={`Are you sure you want to delete warehouse \"${state.warehouseToDelete?.name || ''}\"? This action cannot be undone.`}
	onConfirm={state.handleDelete}
	onCancel={() => {
	  state.showDeleteDialog = false;
	  state.warehouseToDelete = null;
	}}
  />
  
  <ToastList bind:this={state.toastList} />
  