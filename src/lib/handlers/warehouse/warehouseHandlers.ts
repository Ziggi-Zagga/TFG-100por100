
export async function handleCreateWarehouse(formData: FormData) {
    try {
        const res = await fetch('?/create', {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                warehouse: result.warehouse,
                message: `Almacén "${result.warehouse.name}" creado exitosamente`
            };
        } else {
            const error = result.message || 'Error al crear el almacén';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al crear almacén:', error);
        return { 
            success: false, 
            error: 'Error inesperado al crear el almacén' 
        };
    }
}

/**
 * Manejador para actualizar un almacén existente
 */
export async function handleUpdateWarehouse(
    formData: FormData, 
    editingWarehouse: { id: string } | null
) {
    if (!editingWarehouse) {
        return { success: false, error: 'No se ha seleccionado ningún almacén para editar' };
    }

    try {
        formData.append('id', editingWarehouse.id);
        
        const res = await fetch('?/update', {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                warehouse: result.warehouse,
                message: `Almacén "${result.warehouse.name}" actualizado exitosamente`
            };
        } else {
            const error = result.message || 'Error al actualizar el almacén';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al actualizar almacén:', error);
        return { 
            success: false, 
            error: 'Error inesperado al actualizar el almacén' 
        };
    }
}

/**
 * Manejador para eliminar un almacén
 */
export async function handleDeleteWarehouse(warehouseId: string) {
    try {
        const res = await fetch('?/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: warehouseId })
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                message: 'Almacén eliminado exitosamente'
            };
        } else {
            const error = result.message || 'Error al eliminar el almacén';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al eliminar almacén:', error);
        return { 
            success: false, 
            error: 'Error inesperado al eliminar el almacén' 
        };
    }
}

/**
 * Manejador para cargar las secciones de un almacén
 */
export async function loadSections(warehouseId: string, currentSections: any[] = []) {
    if (!warehouseId) {
        console.error('No se proporcionó un ID de almacén válido');
        return [];
    }
    
    console.log(`[loadSections] Iniciando carga de secciones para warehouseId: ${warehouseId}`);
    
    try {
        // Verificar si ya tenemos las secciones cargadas para este almacén
        const hasSectionsForWarehouse = currentSections.length > 0 && 
                                      currentSections[0]?.warehouseId === warehouseId;
        
        if (hasSectionsForWarehouse) {
            console.log('[loadSections] Usando secciones ya cargadas en el estado');
            return currentSections;
        }
        
        // Cargar las secciones desde la API
        const response = await fetch(`/dashboard/warehouses?warehouseId=${warehouseId}`);
        const result = await response.json();
        
        if (response.ok && result.success) {
            const filteredSections = Array.isArray(result.data?.sections) ? 
                                   result.data.sections.filter((s: any) => s.warehouseId === warehouseId) : [];
            
            console.log('[loadSections] Secciones cargadas:', filteredSections);
            return filteredSections;
        } else {
            console.error('[loadSections] Error al cargar secciones:', result.error);
            return [];
        }
    } catch (error) {
        console.error('[loadSections] Error inesperado:', error);
        return [];
    }
}
