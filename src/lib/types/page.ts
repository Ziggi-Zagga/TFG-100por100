/**
 * Tipos para los datos de página
 */

export interface PageData {
    warehouse: Array<{
        id: string;
        name: string;
        location: string | null;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    sections?: Array<{
        id: string;
        name: string;
        warehouseId: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
}
