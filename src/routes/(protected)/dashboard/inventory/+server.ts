import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { inventory } from '$lib/server/db/schema';

// Crear inventario
export async function POST({ request }: RequestEvent) {
  const { action, data } = await request.json();

  if (action === 'create') {
    const { product_id, location_id, stock } = data;

    if (!product_id || !location_id || isNaN(stock)) {
      return json({ success: false, message: 'Missing or invalid data' }, { status: 400 });
    }

    await db.insert(inventory).values({
      product_id,
      location_id,
      quantity: stock,
      min_quantity: 0,
      reorder_quantity: 0,
      last_count: new Date().toISOString()
    });

    return json({ success: true });
  }

  return json({ success: false, message: 'Invalid action' }, { status: 400 });
}

// Eliminar producto de inventario
export async function DELETE({ request }: RequestEvent) {
  const { id } = await request.json();

  if (!id || isNaN(id)) {
    return json({ success: false, message: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    await db.delete(inventory).where(eq(inventory.id, id));
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return json({ success: false, message: 'Failed to delete inventory' }, { status: 500 });
  }
}
