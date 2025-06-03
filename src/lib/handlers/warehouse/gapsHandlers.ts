export interface Gap {
    id: string;
    name: string;
    description?: string;
    rowId: string;
    // Add other gap properties as needed
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Create a new gap
export async function createGapAPI(rowId: string, gapData: Omit<Gap, 'id' | 'rowId'>): Promise<ApiResponse<Gap>> {
    try {
        const response = await fetch(`/api/rows/${rowId}/gaps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gapData),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al crear el hueco');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el hueco';
        return { success: false, error: errorMessage };
    }
}

// Update an existing gap
export async function updateGapAPI(rowId: string, gapId: string, gapData: Partial<Gap>): Promise<ApiResponse<Gap>> {
    try {
        const response = await fetch(`/api/rows/${rowId}/gaps/${gapId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gapData),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al actualizar el hueco');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el hueco';
        return { success: false, error: errorMessage };
    }
}

// Delete a gap
export async function deleteGapAPI(rowId: string, gapId: string): Promise<ApiResponse<void>> {
    try {
        const response = await fetch(`/api/rows/${rowId}/gaps/${gapId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Error al eliminar el hueco');
        }

        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el hueco';
        return { success: false, error: errorMessage };
    }
}

// Load all gaps for a row
export async function loadRowGapsAPI(rowId: string): Promise<ApiResponse<Gap[]>> {
    try {
        const response = await fetch(`/api/rows/${rowId}/gaps`, {
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al cargar los huecos');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los huecos';
        return { success: false, error: errorMessage };
    }
}

// Load a single gap
export async function loadGapAPI(rowId: string, gapId: string): Promise<ApiResponse<Gap>> {
    try {
        const response = await fetch(`/api/rows/${rowId}/gaps/${gapId}`, {
            credentials: 'include', 
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al cargar el hueco');
        }

        return { success: true, data: result.data };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar el hueco';
        return { success: false, error: errorMessage };
    }
}
