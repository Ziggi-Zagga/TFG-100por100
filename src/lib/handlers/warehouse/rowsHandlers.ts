

// Tipos de datos
type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};

type Row = {
    id: string;
    name: string;
    section_id: string;
    created_at?: string;
    updated_at?: string;
};

/**
 * Crea una nueva fila en una sección
 */
export async function handleCreateRow(sectionId: string, rowData: Omit<Row, 'id' | 'section_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Row>> {
    try {
        const response = await fetch(`/api/sections/${sectionId}/rows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al crear la fila');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear la fila';
        return { success: false, error: errorMessage };
    }
}

/**
 * Actualiza una fila existente
 */
export async function handleUpdateRow(sectionId: string, rowId: string, rowData: Partial<Omit<Row, 'id' | 'section_id' | 'created_at'>>): Promise<ApiResponse<Row>> {
    try {
        const response = await fetch(`/api/sections/${sectionId}/rows/${rowId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al actualizar la fila');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar la fila';
        return { success: false, error: errorMessage };
    }
}

/**
 * Elimina una fila
 */
export async function handleDeleteRow(sectionId: string, rowId: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`/api/sections/${sectionId}/rows/${rowId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al eliminar la fila');
        }


        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar la fila';
        return { success: false, error: errorMessage };
    }
}

/**
 * Carga las filas de una sección
 */
export async function loadSectionRows(sectionId: string): Promise<ApiResponse<Row[]>> {
    try {
        const response = await fetch(`/api/sections/${sectionId}/rows`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al cargar las filas');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar las filas';
        return { success: false, error: errorMessage };
    }
}

/**
 * Carga una fila específica
 */
export async function loadRow(sectionId: string, rowId: string): Promise<ApiResponse<Row>> {
    try {
        const response = await fetch(`/api/sections/${sectionId}/rows/${rowId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al cargar la fila');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar la fila';
        return { success: false, error: errorMessage };
    }
}