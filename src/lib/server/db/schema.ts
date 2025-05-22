import { sqliteTable, text, integer, real, foreignKey } from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  permissions: text('permissions', { length: 1000 }),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username', { length: 50 }).notNull().unique(),
  passwordHash: text('passwordHash', { length: 255 }).notNull(),
  email: text('email', { length: 255 }).notNull().unique(),
  active: integer('active', { mode: 'boolean' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  lastLogin: integer('lastLogin', { mode: 'timestamp' }),
  roleId: text('roleId').references(() => roles.id).notNull(),
});

export const userSessions = sqliteTable('userSessions', {
	sessionId: text('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  sessionToken: text('sessionToken', { length: 128 }).unique().notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
});

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  contactPerson: text('contactPerson'),
  email: text('email', { length: 255 }),
  phone: text('phone'),
  website: text('website'),
  notes: text('notes'),
});

export const manufacturers = sqliteTable('manufacturers', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  parentId: text('parentId'),
}, (table) => ({
  parentCategoryFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
  }),
}));

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  code: text('code', { length: 50 }).notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  supplierId: text('supplierId').references(() => suppliers.id),
  manufacturerId: text('manufacturerId').references(() => manufacturers.id),
  categoryId: text('categoryId').references(() => categories.id),
  price: real('price'),
  unit: text('unit', { length: 20 }),
  dimensions: text('dimensions'),
  material: text('material'),
  specifications: text('specifications'),
  active: integer('active', { mode: 'boolean' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});


export const stores = sqliteTable('stores', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  location: text('location', { length: 150 }),
  description: text('description'),
});

export const sections = sqliteTable('sections', {
  id: text('id').primaryKey(),
  storeId: text('storeId').references(() => stores.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

export const storeRows = sqliteTable('storeRows', {
  id: text('id').primaryKey(),
  sectionId: text('sectionId').references(() => sections.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
});

export const storeGaps = sqliteTable('storeGaps', {
  id: text('id').primaryKey(),
  rowId: text('rowId').references(() => storeRows.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
  capacity: real('capacity'),
  notes: text('notes'),
});

export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  productId: text('productId').notNull().references(() => products.id),
  storeGapId: text('storeGapId').notNull().references(() => storeGaps.id),
  quantity: real('quantity').notNull(),
  minQuantity: real('minQuantity'),
  reorderQuantity: real('reorderQuantity'),
  lastCount: integer('lastCount', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const inventoryMovements = sqliteTable('inventoryMovements', {
  id: text('id').primaryKey(),
  type: text('type', { length: 50 }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  userId: text('userId').references(() => users.id),
  reference: text('reference'),
  notes: text('notes'),
});

export const movementItems = sqliteTable('movementItems', {
  id: text('id').primaryKey(),
  movementId: text('movementId').notNull().references(() => inventoryMovements.id),
  inventoryId: text('inventoryId').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('orderNumber', { length: 50 }).notNull().unique(),
  supplierId: text('supplierId').notNull().references(() => suppliers.id),
  userId: text('userId').notNull().references(() => users.id),
  orderDate: integer('orderDate', { mode: 'timestamp' }).notNull(),
  status: text('status', { length: 50 }).notNull(),
  expectedArrival: integer('expectedArrival', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('orderItems', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull().references(() => orders.id),
  productId: text('productId').notNull().references(() => products.id),
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  discount: real('discount'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const orderTracking = sqliteTable('orderTracking', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull().references(() => orders.id),
  trackingNumber: text('trackingNumber'),
  carrier: text('carrier'),
  status: text('status'),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

export const zones = sqliteTable('zones', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

export const machinery = sqliteTable('machinery', {
  id: text('id').primaryKey(),
  code: text('code', { length: 50 }).notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  model: text('model'),
  zoneId: text('zoneId').references(() => zones.id),
  installationDate: integer('installationDate', { mode: 'timestamp' }),
  status: text('status', { length: 50 }),
});

export const incidents = sqliteTable('incidents', {
  id: text('id').primaryKey(),
  code: text('code', { length: 50 }).notNull().unique(),
  title: text('title', { length: 100 }).notNull(),
  description: text('description'),
  machineId: text('machineId').references(() => machinery.id),
  reportedBy: text('reportedBy').references(() => users.id),
  assignedTo: text('assignedTo').references(() => users.id),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  dueDate: integer('dueDate', { mode: 'timestamp' }),
  priority: text('priority'),
  status: text('status'),
  estimatedHours: real('estimatedHours'),
  actualHours: real('actualHours'),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const incidentItems = sqliteTable('incidentItems', {
  id: text('id').primaryKey(),
  incidentId: text('incidentId').notNull().references(() => incidents.id),
  inventoryId: text('inventoryId').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const incidentHistory = sqliteTable('incidentHistory', {
  id: text('id').primaryKey(),
  incidentId: text('incidentId').notNull().references(() => incidents.id),
  userId: text('userId').notNull().references(() => users.id),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  action: text('action'),
  comments: text('comments'),
  statusFrom: text('statusFrom'),
  statusTo: text('statusTo'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
