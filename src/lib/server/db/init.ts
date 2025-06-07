import { db } from '.';
import { roles } from './schema';


export async function initDatabase() {
  // Inicializar roles si no existen
  const existingRoles = await db.select().from(roles);
  const roleIds = existingRoles.map(r => r.id);

  const rolesToInsert = [];

  if (!roleIds.includes('1')) {
    rolesToInsert.push({
      id: '1',
      name: 'admin',
      description: 'Administrator role',
      permissions: 'Full'
    });
  }

  if (!roleIds.includes('2')) {
    rolesToInsert.push({
      id: '2',
      name: 'worker',
      description: 'Worker role',
      permissions: 'Limited'
    });
  }

  if (rolesToInsert.length > 0) {
    await db.insert(roles).values(rolesToInsert);
    console.log('Default roles created:', rolesToInsert);
  }
}
