import {
	getwarehouse,
	createwarehouse,
	updatewarehouse,
	deletewarehouseById,
	getwarehouseWithSections,
	createSection,
	deleteSectionById,
	createRow,
	deleteRowById,
	createGap,
	deleteGapById,
	getSectionWithRows,
	getRowWithGaps
  } from '$lib/server/services/warehouse.service';
  import { ServiceError } from '$lib/utils/errors/ServiceError';
  import { redirect, fail } from '@sveltejs/kit';
  import type { Actions, PageServerLoad } from './$types';
  
  type Section = {
	id: string;
	warehouseId: string;
	name: string;
	location: string | null;
	description: string | null;
  };
  
  export const load: PageServerLoad = async ({ url, fetch }) => {
	try {
	  const warehouse = await getwarehouse();
	  const warehouseId = url.searchParams.get('warehouseId');
	 
	  let sections: Section[] = [];
	  if (warehouseId) {
		try {
		  const data = await getwarehouseWithSections(warehouseId);
		  sections = data.sections || [];
		  
		  // Si no hay secciones, intentar cargarlas de nuevo
		  if (sections.length === 0) {
			console.log('No se encontraron secciones, intentando cargar...');
			try {
			  const data = await getwarehouseWithSections(warehouseId);
			  sections = data.sections || [];
			} catch (innerError) {
			  console.error('Error al recargar secciones:', innerError);
			}
		  }
		} catch (error) {
		  console.error('Error loading sections for warehouse:', warehouseId, error);
		  // No fallar completamente, solo no cargar sections
		}
	  }
	 
	  console.log('Devolviendo datos al cliente:', { 
		warehouseCount: warehouse.length,
		sectionsCount: sections.length,
		currentWarehouseId: warehouseId
	  });
	  
	  return {
		warehouse,
		sections,
		currentWarehouseId: warehouseId || null
	  };
	} catch (error) {
	  console.error('Error in page load:', error);
	  // Retornar datos vacíos en lugar de fallar
	  return {
		warehouse: [],
		sections: [],
		currentWarehouseId: null
	  };
	}
  };
  
  export const actions: Actions = {
	// ============ ACCIONES PARA WAREHOUSES ============
	create: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const name = formData.get('name')?.toString()?.trim() ?? '';
		const location = formData.get('location')?.toString()?.trim() ?? '';
		const description = formData.get('description')?.toString()?.trim() ?? '';
		   
		if (!name || !location) {
		  return fail(400, { 
			message: 'Name and location are required',
			success: false 
		  });
		}
  
		const newwarehouse = await createwarehouse({ 
		  name, 
		  location, 
		  description: description || undefined 
		});
		
		return { 
		  warehouse: newwarehouse, 
		  success: true,
		  message: `Warehouse "${name}" created successfully`
		};
	  } catch (error) {
		console.error('Error creating warehouse:', error);
		return fail(500, { 
		  message: error instanceof ServiceError ? error.message : 'Failed to create warehouse',
		  success: false 
		});
	  }
	},
  
	update: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString()?.trim() || '';
		const location = formData.get('location')?.toString()?.trim() || '';
		const description = formData.get('description')?.toString()?.trim() || '';
  
		if (!id) {
		  return fail(400, { 
			message: 'Warehouse ID is required',
			success: false 
		  });
		}
  
		if (!name || !location) {
		  return fail(400, { 
			message: 'Name and location are required',
			success: false 
		  });
		}
  
		const updateData = {
		  name,
		  location,
		  description: description || null
		};
		   
		const updatedwarehouse = await updatewarehouse(id, updateData);
		
		return { 
		  success: true, 
		  warehouse: updatedwarehouse,
		  message: `Warehouse "${name}" updated successfully`
		};
	  } catch (error) {
		console.error('Error updating warehouse:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to update warehouse',
		  success: false
		});
	  }
	},
  
	delete: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
  
		if (!id) {
		  return fail(400, { 
			message: 'Warehouse ID is required',
			success: false 
		  });
		}
  
		await deletewarehouseById(id);
		
		return { 
		  success: true,
		  message: 'Warehouse deleted successfully'
		};
	  } catch (error) {
		console.error('Error deleting warehouse:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to delete warehouse',
		  success: false
		});
	  }
	},
  
	// ============ ACCIONES PARA SECTIONS ============
	createSection: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const warehouseId = formData.get('warehouseId')?.toString();
		const name = formData.get('name')?.toString()?.trim() ?? '';
		const location = formData.get('location')?.toString()?.trim() ?? '';
		const description = formData.get('description')?.toString()?.trim() ?? '';
  
		if (!warehouseId || !name) {
		  return fail(400, { 
			message: 'Warehouse ID and section name are required',
			success: false 
		  });
		}
  
		const newSection = await createSection({
		  warehouseId,
		  name,
		  location: location || undefined,
		  description: description || undefined
		});
  
		return { 
		  section: newSection, 
		  success: true,
		  message: `Section "${name}" created successfully`
		};
	  } catch (error) {
		console.error('Error creating section:', error);
		return fail(500, { 
		  message: error instanceof ServiceError ? error.message : 'Failed to create section',
		  success: false 
		});
	  }
	},
  
	deleteSection: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const sectionId = formData.get('sectionId')?.toString();
  
		if (!sectionId) {
		  return fail(400, { 
			message: 'Section ID is required',
			success: false 
		  });
		}
  
		await deleteSectionById(sectionId);
		
		return { 
		  success: true,
		  message: 'Section deleted successfully'
		};
	  } catch (error) {
		console.error('Error deleting section:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to delete section',
		  success: false
		});
	  }
	},
  
	// ============ ACCION PARA OBTENER SECTIONS DE UN WAREHOUSE ============
	getSections: async ({ request, url }) => {
	  try {
		// Obtener warehouseId desde URL params o form data
		const warehouseId = url.searchParams.get('warehouseId') || 
					   (await request.formData()).get('warehouseId')?.toString();
  
		if (!warehouseId) {
		  return fail(400, { 
			message: 'Warehouse ID is required',
			success: false 
		  });
		}
  
		const data = await getwarehouseWithSections(warehouseId);
		
		return { 
		  sections: data.sections || [],
		  warehouse: data.warehouse,
		  success: true
		};
	  } catch (error) {
		console.error('Error loading sections:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to load sections',
		  success: false,
		  sections: []
		});
	  }
	},

	// ============ ACCIONES PARA ROWS ============
	createRow: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const sectionId = formData.get('sectionId')?.toString();
		const name = formData.get('name')?.toString()?.trim() ?? '';
		const description = formData.get('description')?.toString()?.trim() ?? '';

		if (!sectionId || !name) {
		  return fail(400, { 
			message: 'Section ID and row name are required',
			success: false 
		  });
		}

		const newRow = await createRow({
		  sectionId,
		  name
		});

		return { 
		  row: newRow, 
		  success: true,
		  message: `Row "${name}" created successfully`
		};
	  } catch (error) {
		console.error('Error creating row:', error);
		return fail(500, { 
		  message: error instanceof ServiceError ? error.message : 'Failed to create row',
		  success: false 
		});
	  }
	},

	deleteRow: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const rowId = formData.get('rowId')?.toString();

		if (!rowId) {
		  return fail(400, { 
			message: 'Row ID is required',
			success: false 
		  });
		}

		await deleteRowById(rowId);
		
		return { 
		  success: true,
		  message: 'Row deleted successfully'
		};
	  } catch (error) {
		console.error('Error deleting row:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to delete row',
		  success: false
		});
	  }
	},

	getRows: async ({ request, url }) => {
	  try {
		const sectionId = url.searchParams.get('sectionId') || 
					   (await request.formData()).get('sectionId')?.toString();
  
		if (!sectionId) {
		  return fail(400, { 
			message: 'Section ID is required',
			success: false 
		  });
		}
  
		const data = await getSectionWithRows(sectionId);
		
		return { 
		  rows: data.rows || [],
		  section: data.section,
		  success: true
		};
	  } catch (error) {
		console.error('Error loading rows:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to load rows',
		  success: false,
		  rows: []
		});
	  }
	},

	// ============ ACCIONES PARA GAPS ============
	createGap: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const rowId = formData.get('rowId')?.toString();
		const name = formData.get('name')?.toString()?.trim() ?? '';
		const capacity = formData.get('capacity') ? Number(formData.get('capacity')) : undefined;
		const notes = formData.get('notes')?.toString()?.trim() ?? '';

		if (!rowId || !name) {
		  return fail(400, { 
			message: 'Row ID and gap name are required',
			success: false 
		  });
		}

		const newGap = await createGap({
		  rowId,
		  name,
		  capacity,
		  notes: notes || undefined
		});

		return { 
		  gap: newGap, 
		  success: true,
		  message: `Gap "${name}" created successfully`
		};
	  } catch (error) {
		console.error('Error creating gap:', error);
		return fail(500, { 
		  message: error instanceof ServiceError ? error.message : 'Failed to create gap',
		  success: false 
		});
	  }
	},

	deleteGap: async ({ request }) => {
	  try {
		const formData = await request.formData();
		const gapId = formData.get('gapId')?.toString();

		if (!gapId) {
		  return fail(400, { 
			message: 'Gap ID is required',
			success: false 
		  });
		}

		await deleteGapById(gapId);
		
		return { 
		  success: true,
		  message: 'Gap deleted successfully'
		};
	  } catch (error) {
		console.error('Error deleting gap:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to delete gap',
		  success: false
		});
	  }
	},

	getGaps: async ({ request, url }) => {
	  try {
		const rowId = url.searchParams.get('rowId') || 
				   (await request.formData()).get('rowId')?.toString();
  
		if (!rowId) {
		  return fail(400, { 
			message: 'Row ID is required',
			success: false 
		  });
		}
  
		const data = await getRowWithGaps(rowId);
		
		return { 
		  gaps: data.gaps || [],
		  row: data.row,
		  success: true
		};
	  } catch (error) {
		console.error('Error loading gaps:', error);
		return fail(500, {
		  message: error instanceof ServiceError ? error.message : 'Failed to load gaps',
		  success: false,
		  gaps: []
		});
	  }
	}
  };