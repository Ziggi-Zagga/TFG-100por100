import { json } from '@sveltejs/kit';
import { 
  getwarehouseWithSections,
  getSectionWithRows,
  getRowWithGaps
} from '$lib/server/services/warehouse.service';
import type { RequestHandler } from './$types';

// Endpoint para obtener datos jerárquicos
export const GET: RequestHandler = async ({ url, params }) => {
  try {
    // Obtener parámetros de la URL
    const warehouseId = url.searchParams.get('warehouseId');
    const sectionId = url.searchParams.get('sectionId');
    const rowId = url.searchParams.get('rowId');

    // 1. Si hay rowId, obtener huecos de la fila
    if (rowId) {
      console.log(`[API] Fetching gaps for row: ${rowId}`);
      const data = await getRowWithGaps(rowId);
      return json({
        success: true,
        type: 'gaps',
        data: {
          gaps: data.gaps || [],
          row: data.row
        }
      });
    }

    // 2. Si hay sectionId, obtener filas de la sección
    if (sectionId) {
      console.log(`[API] Fetching rows for section: ${sectionId}`);
      const data = await getSectionWithRows(sectionId);
      return json({
        success: true,
        type: 'rows',
        data: {
          rows: data.rows || [],
          section: data.section
        }
      });
    }

    // 3. Si hay warehouseId, obtener secciones del almacén
    if (warehouseId) {
      console.log(`[API] Fetching sections for warehouse: ${warehouseId}`);
      const data = await getwarehouseWithSections(warehouseId);
      return json({
        success: true,
        type: 'sections',
        data: {
          sections: data.sections || [],
          warehouse: data.warehouse
        }
      });
    }

    // Si no hay parámetros válidos
    return json({
      success: false,
      error: 'Se requiere warehouseId, sectionId o rowId'
    }, { status: 400 });

  } catch (error) {
    console.error('[API] Error:', error);
    return json({
      success: false,
      error: 'Error al obtener los datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
};

// Manejador para otras rutas
export const fallback: RequestHandler = async ({ request, params }) => {
    const url = new URL(request.url);
    
    // Si la ruta empieza con /sections/
    if (url.pathname.startsWith('/dashboard/warehouses/sections/')) {
        const warehouseId = url.pathname.split('/').pop();
        if (warehouseId) {
            // Redirigir a la función GET con el warehouseId
            return GET({ params: { warehouseId } } as any);
        }
    }
    
    // Para cualquier otra ruta, devolver 404
    return json({
        success: false,
        error: 'Not found'
    }, { status: 404 });
};
