import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { inventory } from '$lib/server/db/schema';

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
