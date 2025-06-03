
import {
  getwarehouseWithSections,
  deletewarehouseById,
  updatewarehouse,
  createwarehouse
} from '$lib/server/services/warehouse.service';

export function useWarehousePage() {
  // Estado de datos
  let warehouse = $state([]);
  let sections = $state([]);
  let rows = $state([]);
  let gaps = $state([]);

  // UI y navegación
  let search = $state('');
  let isLoadingSections = $state(false);
  let toastList = $state<any>(null);

  let currentView = $state<'warehouses' | 'sections' | 'rows' | 'gaps'>('warehouses');
  let selectedWarehouse = $state<any>(null);
  let selectedSection = $state<any>(null);
  let selectedRow = $state<any>(null);
  let selectedGap = $state<any>(null);

  // Drawers
  let showDrawer = $state(false);
  let showEditDrawer = $state(false);
  let showSectionDrawer = $state(false);
  let showRowDrawer = $state(false);
  let showGapDrawer = $state(false);
  let showDeleteDialog = $state(false);

  let warehouseToDelete = $state<{ id: string, name: string } | null>(null);
  let editingwarehouse = $state<any>(null);

  // Animaciones
  let isAnimating = $state(false);
  let fadeWarehouses = $state(false);
  let fadeSections = $state(false);
  let showSectionsView = $state(false);
  let showCircleBar = $state(false);
  let showConnectedCircles = $state(false);
  let hideOriginalHeader = $state(false);
  let sectionsAnimateIn = $state(false);

  // Funciones utilitarias
  function showSuccess(msg: string) {
    toastList?.addToast(msg, 'success');
  }
  function showError(msg: string) {
    toastList?.addToast(msg, 'error');
  }

  // Drawers
  function openDrawer() { showDrawer = true; }
  function closeDrawer() { showDrawer = false; }
  function closeEditDrawer() {
    showEditDrawer = false;
    editingwarehouse = null;
  }

  // CRUD
  async function handleCreateWarehouse(formData: FormData) {
    let result = await createwarehouse(formData);
    if (result.success) {
      warehouse = [result.warehouse, ...warehouse];
      showDrawer = false;
      showSuccess(result.message);
    } else {
      showError(result.error);
    }
  }

  async function handleUpdateWarehouse(formData: FormData) {
    if (!editingwarehouse) return;
    let result = await updatewarehouse(formData, editingwarehouse);
    if (result.success) {
      warehouse = warehouse.map(w =>
        w.id === editingwarehouse.id ? { ...w, ...result.warehouse } : w
      );
      showSuccess(result.message);
      closeEditDrawer();
    } else {
      showError(result.error);
    }
  }

  async function handleDelete() {
    if (!warehouseToDelete) return;
    let result = await deletewarehouseById(warehouseToDelete.id);
    if (result.success) {
      warehouse = warehouse.filter(w => w.id !== warehouseToDelete.id);
      showSuccess(result.message);
    } else {
      showError(result.error);
    }
    showDeleteDialog = false;
    warehouseToDelete = null;
  }

  function handleEdit(e: { detail: { id: string } }) {
    let found = warehouse.find(w => w.id === e.detail.id);
    if (found) {
      editingwarehouse = found;
      showEditDrawer = true;
    }
  }

  // (más funciones se agregarán después)

  async function loadSections(warehouseId: string) {
    isLoadingSections = true;
    try {
      let result = await getwarehouseWithSections(warehouseId);
      if (result.sections.length > 0) {
        sections = [...result.sections];
      } else {
        window.location.href = `/dashboard/warehouses?warehouseId=${warehouseId}`;
      }
    } catch (e) {
      console.error('Error loading sections:', e);
    } finally {
      isLoadingSections = false;
    }
  }

  async function handleWarehouseCardClick({ warehouse: w, iconContainer }: { warehouse: any, iconContainer: HTMLElement }) {
    if (isAnimating) return;

    isAnimating = true;
    selectedWarehouse = w;
    hideOriginalHeader = true;
    setTimeout(() => { fadeWarehouses = true }, 10);

    let rect = iconContainer.getBoundingClientRect();
    let startX = rect.left + rect.width / 2;
    let startY = rect.top + rect.height / 2;

    let headerElement = document.querySelector('.page-header') || document.querySelector('section');
    let headerRect = headerElement?.getBoundingClientRect();
    let finalX = 120;
    let finalY = headerRect ? headerRect.top + 60 : 80;

    let animatedIcon = document.createElement('div');
    animatedIcon.className = 'fixed flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600';
    animatedIcon.style.zIndex = '100';
    animatedIcon.innerHTML = '<img src="/icons/svg/warehouse.svg" class="w-12 h-12" alt="warehouse" />';
    animatedIcon.style.left = `${startX - 40}px`;
    animatedIcon.style.top = `${startY - 40}px`;
    animatedIcon.style.transform = 'scale(1)';
    animatedIcon.style.pointerEvents = 'none';
    animatedIcon.style.transition = 'all 0.8s ease';

    document.body.appendChild(animatedIcon);
    iconContainer.style.opacity = '0';

    setTimeout(() => {
      animatedIcon.style.left = `${finalX + 133}px`;
      animatedIcon.style.top = `${finalY - 62}px`;
      animatedIcon.style.transform = 'scale(0.8)';
    }, 50);

    setTimeout(async () => {
      try {
        await loadSections(w.id);
        currentView = 'sections';
        showSectionsView = true;
        showCircleBar = true;
        showConnectedCircles = true;
        document.body.removeChild(animatedIcon);
        sectionsAnimateIn = true;
      } catch (error) {
        showError('Error al cargar las secciones del almacén');
      } finally {
        isAnimating = false;
      }
    }, 1100);
  }

  async function handleSectionSelected(section: any) {
    if (!section?.id || isAnimating) return;
    selectedSection = section;

    let url = new URL(window.location.href);
    url.searchParams.set('sectionId', section.id);
    url.searchParams.delete('rowId');
    window.history.pushState({}, '', url);

    currentView = 'rows';
    showSectionsView = false;

    try {
      let res = await fetch(`/dashboard/warehouses?sectionId=${section.id}`);
      let json = await res.json();
      rows = json?.data?.rows || [];
    } catch (error) {
      showError('Error al cargar las filas');
    }
  }

  async function handleRowSelected(row: any) {
    if (isAnimating) return;
    isAnimating = true;
    try {
      let res = await fetch(`/dashboard/warehouses?rowId=${row.id}`);
      let json = await res.json();
      selectedRow = row;
      gaps = json?.data?.gaps || [];
      currentView = 'gaps';

      let url = new URL(window.location.href);
      url.searchParams.set('rowId', row.id);
      window.history.pushState({}, '', url);
    } catch (error) {
      showError('Error al cargar los huecos');
    } finally {
      isAnimating = false;
    }
  }

  function handleGapSelected(gap: any) {
    selectedGap = gap;
  }

  function handleSearchChange(value: string) {
    search = value;
  }

  function handleAddSection(formData: FormData) {
    let section = {
      id: crypto.randomUUID(),
      name: formData.get('name'),
      description: formData.get('description'),
      warehouseId: selectedWarehouse?.id
    };
    sections = [...sections, section];
    showSectionDrawer = false;
  }

  function handleAddRow(formData: FormData) {
    let row = {
      id: crypto.randomUUID(),
      name: formData.get('name'),
      description: formData.get('description'),
      sectionId: selectedSection?.id
    };
    rows = [...rows, row];
    showRowDrawer = false;
  }

  function handleAddGap(formData: FormData) {
    let gap = {
      id: crypto.randomUUID(),
      name: formData.get('name'),
      notes: formData.get('notes'),
      capacity: formData.get('capacity'),
      rowId: selectedRow?.id
    };
    gaps = [...gaps, gap];
    showGapDrawer = false;
  }

  function handleDeleteRow(row: any) {
    rows = rows.filter(r => r.id !== row.id);
  }

  function backToRows() {
    currentView = 'rows';
    selectedGap = null;
  }

  function backToSections() {
    currentView = 'sections';
    selectedRow = null;
    rows = [];
  }

  function backToWarehouses() {
    currentView = 'warehouses';
    selectedWarehouse = null;
    showSectionsView = false;
    showCircleBar = false;
    showConnectedCircles = false;
    fadeWarehouses = false;
    fadeSections = false;
  }
  function getLineWidth(): number {
    switch (currentView) {
      case 'sections': return 100;
      case 'rows': return 240;
      case 'gaps': return 400;
      default: return 0;
    }
  }

  function getCircleStyles(view: string): string {
    let order = ['warehouses', 'sections', 'rows', 'gaps'];
    let ci = order.indexOf(currentView);
    let vi = order.indexOf(view);
    if (vi === ci) return 'bg-indigo-600 text-white';
    if (vi < ci) {
      switch (view) {
        case 'warehouses': return 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200';
        case 'sections': return 'bg-green-100 text-green-600 hover:bg-green-200';
        case 'rows': return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
        default: return 'bg-gray-100 text-gray-400';
      }
    }
    return 'bg-gray-100 text-gray-400';
  }

  function getIletyles(view: string): string {
    let order = ['warehouses', 'sections', 'rows', 'gaps'];
    return order.indexOf(view) > order.indexOf(currentView) ? 'opacity-50' : '';
  }

  function getCircleClickability(view: string): string {
    let order = ['warehouses', 'sections', 'rows', 'gaps'];
    let ci = order.indexOf(currentView);
    let vi = order.indexOf(view);
    if (vi < ci) return 'cursor-pointer hover:scale-105';
    if (vi === ci) return 'cursor-default';
    return 'cursor-not-allowed opacity-75';
  }

  function getCircleClickHandler(view: string): (() => void) | undefined {
    let order = ['warehouses', 'sections', 'rows', 'gaps'];
    let ci = order.indexOf(currentView);
    let vi = order.indexOf(view);
    if (vi > ci) return undefined;
    if (view === 'warehouses') return backToWarehouses;
    if (view === 'sections') return backToSections;
    if (view === 'rows') return backToRows;
    if (view === 'gaps' && selectedRow) return () => handleRowSelected(selectedRow);
    return undefined;
  }

  function getCircleTitle(view: string): string {
    let order = ['warehouses', 'sections', 'rows', 'gaps'];
    let ci = order.indexOf(currentView);
    let vi = order.indexOf(view);
    if (vi === ci) return `Vista actual: ${view}`;
    if (vi < ci) return `Volver a ${view}`;
    switch (view) {
      case 'sections': return 'Selecciona un almacén primero';
      case 'rows': return 'Selecciona una sección primero';
      case 'gaps': return 'Selecciona una fila primero';
      default: return 'No disponible';
    }
  }

  function getSearchPlaceholder(): string {
    switch (currentView) {
      case 'warehouses': return 'Search warehouses...';
      case 'sections': return 'Search sections...';
      case 'rows': return 'Search rows...';
      case 'gaps': return 'Search gaps...';
      default: return 'Search...';
    }
  }

  function getAddButtonText(): string {
    switch (currentView) {
      case 'warehouses': return 'Add Warehouse';
      case 'sections': return 'Add Section';
      case 'rows': return 'Add Row';
      case 'gaps': return 'Add Gap';
      default: return 'Add';
    }
  }

  function getAddButtonHandler(): () => void {
    switch (currentView) {
      case 'warehouses': return openDrawer;
      case 'sections': return () => showSectionDrawer = true;
      case 'rows': return () => showRowDrawer = true;
      case 'gaps': return () => showGapDrawer = true;
      default: return () => {};
    }
  }
  async function handleWarehouseCardClick(clickEvent: { warehouse: any; iconContainer: HTMLElement }) {
    let animatedIcon: HTMLElement | null = null;
    let { warehouse: warehouseItem, iconContainer } = clickEvent;
  
    try {
      if (isAnimating) return;
  
      // Preparar estado
      isAnimating = true;
      selectedWarehouse = warehouseItem;
      animatingElement = iconContainer;
      hideOriginalHeader = true;
  
      // Desvanecer la vista actual
      setTimeout(() => {
        fadeWarehouses = true;
      }, 10);
  
      // Obtener posición inicial
      await new Promise((resolve) => requestAnimationFrame(resolve));
      let rect = iconContainer.getBoundingClientRect();
      let startX = rect.left + rect.width / 2;
      let startY = rect.top + rect.height / 2;
  
      let headerElement = document.querySelector('.page-header') || document.querySelector('section');
      let headerRect = headerElement?.getBoundingClientRect();
      let finalX = 120;
      let finalY = headerRect ? headerRect.top + 60 : 80;
  
      // Crear icono animado
      animatedIcon = document.createElement('div');
      animatedIcon.className = 'fixed flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600';
      animatedIcon.style.zIndex = '100';
      animatedIcon.innerHTML = '<img src="/icons/svg/warehouse.svg" class="w-12 h-12" alt="warehouse" />';
      animatedIcon.style.left = `${startX - 40}px`;
      animatedIcon.style.top = `${startY - 40}px`;
      animatedIcon.style.transform = 'scale(1)';
      animatedIcon.style.pointerEvents = 'none';
      animatedIcon.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(animatedIcon);
  
      // Ocultar el icono original
      void animatedIcon.offsetWidth;
      iconContainer.style.opacity = '0';
  
      // Mover a destino
      setTimeout(() => {
        if (!animatedIcon) return;
        animatedIcon.style.left = `${finalX + 133}px`;
        animatedIcon.style.top = `${finalY - 62}px`;
        animatedIcon.style.transform = 'scale(0.8)';
        animatedIcon.style.transition = 'all 1s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)';
      }, 50);
  
      // Mostrar secciones tras la animación
      setTimeout(async () => {
        await loadSections(warehouseItem.id);
        showConnectedCircles = true;
        showCircleBar = true;
        currentView = 'sections';
        showSectionsView = true;
  
        if (animatedIcon && document.body.contains(animatedIcon)) {
          document.body.removeChild(animatedIcon);
        }
  
        setTimeout(() => {
          sectionsAnimateIn = true;
        }, 50);
  
        setTimeout(() => {
          isAnimating = false;
        }, 1000);
      }, 1100);
    } catch (error) {
      console.error('[handleWarehouseCardClick] Error inesperado:', error);
      showError('Ocurrió un error inesperado');
  
      if (animatedIcon && document.body.contains(animatedIcon)) {
        document.body.removeChild(animatedIcon);
      }
  
      if (animatingElement) {
        animatingElement.style.opacity = '1';
        animatingElement = null;
      }
  
      isAnimating = false;
    }
  }
  

  return {
    warehouse,
    sections,
    rows,
    gaps,
    toastList,
    search,
    isLoadingSections,
    currentView,
    selectedWarehouse,
    selectedSection,
    selectedRow,
    selectedGap,
    showDrawer,
    showEditDrawer,
    showSectionDrawer,
    showRowDrawer,
    showGapDrawer,
    showDeleteDialog,
    warehouseToDelete,
    editingwarehouse,
    hideOriginalHeader,
    fadeWarehouses,
    fadeSections,
    showSectionsView,
    showCircleBar,
    showConnectedCircles,
    sectionsAnimateIn,
    openDrawer,
    closeDrawer,
    closeEditDrawer,
    handleEdit,
    handleDelete,
    handleUpdateWarehouse,
    handleCreateWarehouse,
    getLineWidth,
    getCircleStyles,
    getIletyles,
    getCircleClickability,
    getCircleClickHandler,
    getCircleTitle,
    getSearchPlaceholder,
    getAddButtonText,
    getAddButtonHandler,
    handleSearchChange,
    handleWarehouseCardClick,
    handleSectionSelected,
    handleRowSelected,
    handleGapSelected,
    handleAddSection,
    handleAddRow,
    handleAddGap,
    handleDeleteRow,
    backToRows,
    backToSections,
    backToWarehouses
};
}
