import type { PageData } from '$lib/types/page';

/**
 * Manejador para la creación de una nueva sección
 */
export async function handleCreateSection(formData: FormData, warehouseId: string) {
    try {
        formData.append('warehouseId', warehouseId);
        
        const res = await fetch(`/dashboard/warehouses/sections/create`, {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                section: result.section,
                message: `Sección "${result.section.name}" creada exitosamente`
            };
        } else {
            const error = result.message || 'Error al crear la sección';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al crear sección:', error);
        return { 
            success: false, 
            error: 'Error inesperado al crear la sección' 
        };
    }
}

/**
 * Manejador para actualizar una sección existente
 */
export async function handleUpdateSection(
    formData: FormData, 
    sectionId: string
) {
    try {
        formData.append('id', sectionId);
        
        const res = await fetch(`/dashboard/warehouses/sections/update`, {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                section: result.section,
                message: `Sección "${result.section.name}" actualizada exitosamente`
            };
        } else {
            const error = result.message || 'Error al actualizar la sección';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al actualizar sección:', error);
        return { 
            success: false, 
            error: 'Error inesperado al actualizar la sección' 
        };
    }
}

/**
 * Manejador para eliminar una sección
 */
export async function handleDeleteSection(sectionId: string) {
    try {
        const res = await fetch(`/dashboard/warehouses/sections/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: sectionId })
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
            return {
                success: true,
                message: 'Sección eliminada exitosamente'
            };
        } else {
            const error = result.message || 'Error al eliminar la sección';
            return { success: false, error };
        }
    } catch (error) {
        console.error('Error al eliminar sección:', error);
        return { 
            success: false, 
            error: 'Error inesperado al eliminar la sección' 
        };
    }
}

/**
 * Manejador para cargar las filas de una sección
 */
export async function loadSectionRows(sectionId: string): Promise<any[]> {
    if (!sectionId) {
        console.error('No se proporcionó un ID de sección válido');
        return [];
    }
    
    console.log(`[loadSectionRows] Iniciando carga de filas para sectionId: ${sectionId}`);
    
    try {
        const response = await fetch(`/dashboard/warehouses?sectionId=${sectionId}`);
        const result = await response.json();
        
        if (response.ok && result.success) {
            const rows = Array.isArray(result.data?.rows) ? result.data.rows : [];
            console.log('[loadSectionRows] Filas cargadas:', rows);
            return rows;
        } else {
            console.error('[loadSectionRows] Error al cargar filas:', result.error);
            return [];
        }
    } catch (error) {
        console.error('[loadSectionRows] Error inesperado:', error);
        return [];
    }
}