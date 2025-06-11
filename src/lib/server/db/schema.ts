import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
	serial,
	decimal,
	primaryKey,
	foreignKey
} from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	permissions: text('permissions')
});

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	email: text('email').notNull().unique(),
	active: boolean('active').notNull().default(true),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	lastLogin: timestamp('last_login'),
	roleId: text('role_id')
		.references(() => roles.id)
		.notNull()
});

export const userSessions = pgTable('user_sessions', {
	sessionId: text('session_id').primaryKey(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at').notNull(),
	sessionHash: text('session_hash').unique().notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent')
});

export const suppliers = pgTable('suppliers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	contactPerson: text('contact_person'),
	email: text('email'),
	phone: text('phone'),
	website: text('website'),
	notes: text('notes')
});

export const manufacturers = pgTable('manufacturers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description')
});

export const categories = pgTable(
	'categories',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		description: text('description'),
		parentId: text('parent_id')
	},
	(table) => ({
		parentFk: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: 'categories_parent_id_fk'
		})
	})
);

export const products = pgTable('products', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	code: text('code').notNull().unique(),
	description: text('description'),
	price: integer('price').notNull(),
	unit: text('unit').notNull(),
	dimensions: text('dimensions'),
	material: text('material'),
	specifications: text('specifications'),
	supplierId: text('supplier_id').references(() => suppliers.id),
	supplierName: text('supplier_name'),
	categoryId: text('category_id').references(() => categories.id),
	categoryName: text('category_name'),
	categoryDescription: text('category_description'),
	categoryParentId: text('category_parent_id'),
	manufacturerId: text('manufacturer_id').references(() => manufacturers.id),
	manufacturerName: text('manufacturer_name'),
	notes: text('notes'),
	active: boolean('active').default(true)
});

export const warehouses = pgTable('warehouses', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	location: text('location'),
	description: text('description')
});

export const sections = pgTable('sections', {
	id: text('id').primaryKey(),
	warehouseId: text('warehouse_id')
		.references(() => warehouses.id)
		.notNull(),
	location: text('location'),
	name: text('name').notNull(),
	description: text('description')
});

export const warehouseRows = pgTable('warehouse_rows', {
	id: text('id').primaryKey(),
	sectionId: text('section_id')
		.references(() => sections.id)
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	location: text('location')
});

export const warehouseGaps = pgTable('warehouse_gaps', {
	id: text('id').primaryKey(),
	rowId: text('row_id')
		.references(() => warehouseRows.id)
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	capacity: integer('capacity')
});

export const inventory = pgTable('inventory', {
	id: text('id').primaryKey(),
	productId: text('product_id')
		.references(() => products.id)
		.notNull(),
	warehouseGapId: text('warehouse_gap_id')
		.references(() => warehouseGaps.id)
		.notNull(),
	quantity: integer('quantity').notNull().default(0),
	minQuantity: integer('min_quantity'),
	reorderQuantity: integer('reorder_quantity'),
	lastCount: timestamp('last_count'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const inventoryHistory = pgTable('inventory_history', {
	id: text('id').primaryKey(),
	productId: text('productId')
		.notNull()
		.references(() => products.id),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventory.id),
	fromGapId: text('fromGapId').references(() => warehouseGaps.id),
	toGapId: text('toGapId').references(() => warehouseGaps.id),
	previousQuantity: integer('previousQuantity'),
	newQuantity: integer('newQuantity'),
	quantityChanged: integer('quantityChanged').notNull(),
	userId: text('userId').references(() => users.id),
	notes: text('notes'),
	createdAt: timestamp('createdAt').notNull().defaultNow()
});
export const orders = pgTable('orders', {
	id: text('id').primaryKey(),
	orderNumber: text('order_number').notNull().unique(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	supplierId: text('supplier_id')
		.references(() => suppliers.id)
		.notNull(),
	orderDate: timestamp('order_date').notNull().defaultNow(),
	expectedArrival: timestamp('expected_arrival'),
	status: text('status', { enum: ['pending', 'received', 'cancelled', 'partial'] })
		.notNull()
		.default('pending'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const orderItems = pgTable('order_items', {
	id: text('id').primaryKey(),
	orderId: text('order_id')
		.references(() => orders.id)
		.notNull(),
	productId: text('product_id')
		.references(() => products.id)
		.notNull(),
	quantity: integer('quantity').notNull(),
	price: integer('price').notNull(),
	discount: integer('discount'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

// export const orderTracking = sqliteTable('orderTracking', {
//   id: text('id').primaryKey(),
//   orderId: text('orderId').notNull().references(() => orders.id),
//   trackingNumber: text('trackingNumber'),
//   carrier: text('carrier'),
//   status: text('status'),
//   updatedAt: integer('updatedAt', { mode: 'timestamp' }),
// });

// export const zones = sqliteTable('zones', {
//   id: text('id').primaryKey(),
//   name: text('name', { length: 100 }).notNull(),
//   description: text('description'),
// });

// export const machinery = sqliteTable('machinery', {
//   id: text('id').primaryKey(),
//   code: text('code', { length: 50 }).notNull().unique(),
//   name: text('name', { length: 100 }).notNull(),
//   model: text('model'),
//   zoneId: text('zoneId').references(() => zones.id),
//   installationDate: integer('installationDate', { mode: 'timestamp' }),
//   status: text('status', { length: 50 }),
// });

// export const incidents = sqliteTable('incidents', {
//   id: text('id').primaryKey(),
//   code: text('code', { length: 50 }).notNull().unique(),
//   title: text('title', { length: 100 }).notNull(),
//   description: text('description'),
//   machineId: text('machineId').references(() => machinery.id),
//   reportedBy: text('reportedBy').references(() => users.id),
//   assignedTo: text('assignedTo').references(() => users.id),
//   createdAt: integer('createdAt', { mode: 'timestamp' }),
//   dueDate: integer('dueDate', { mode: 'timestamp' }),
//   priority: text('priority'),
//   status: text('status'),
//   estimatedHours: real('estimatedHours'),
//   actualHours: real('actualHours'),
//   updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
// });

// export const incidentItems = sqliteTable('incidentItems', {
//   id: text('id').primaryKey(),
//   incidentId: text('incidentId').notNull().references(() => incidents.id),
//   inventoryId: text('inventoryId').notNull().references(() => inventory.id),
//   quantity: real('quantity').notNull(),
//   createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
//   updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
// });

// export const incidentHistory = sqliteTable('incidentHistory', {
//   id: text('id').primaryKey(),
//   incidentId: text('incidentId').notNull().references(() => incidents.id),
//   userId: text('userId').notNull().references(() => users.id),
//   timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
//   action: text('action'),
//   comments: text('comments'),
//   statusFrom: text('statusFrom'),
//   statusTo: text('statusTo'),
//   createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
//   updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
// });
