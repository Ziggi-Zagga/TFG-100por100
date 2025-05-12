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
  password_hash: text('password_hash', { length: 128 }).notNull(),
  email: text('email', { length: 255 }).notNull().unique(),
  full_name: text('full_name', { length: 100 }).notNull(),
  active: integer('active', { mode: 'boolean' }).notNull(),
  created_at: text('created_at').notNull(),
  last_login: text('last_login'),
  rol: integer('roles_id').references(() => roles.id),
});

export const userSessions = sqliteTable('user_sessions', {
  session_id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  session_token: text('session_token', { length: 128 }).notNull().unique(),
  created_at: text('created_at').notNull(),
  expires_at: text('expires_at').notNull(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
});

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  contact_person: text('contact_person'),
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
  parent_id: text('parent_id'),
}, (table) => ({
  parentCategoryFk: foreignKey({
    columns: [table.parent_id],
    foreignColumns: [table.id],
  }),
}));

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  code: text('code', { length: 50 }).notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  supplier_id: text('supplier_id').references(() => suppliers.id),
  manufacturer_id: text('manufacturer_id').references(() => manufacturers.id),
  category_id: text('category_id').references(() => categories.id),
  price: real('price'),
  unit: text('unit', { length: 20 }),
  dimensions: text('dimensions'),
  material: text('material'),
  specifications: text('specifications'),
  active: integer('active', { mode: 'boolean' }).notNull(),
});


export const stores = sqliteTable('stores', {
  id: text('id').primaryKey(),
  name: text('name', { length: 100 }).notNull(),
  location: text('location', { length: 150 }),
  description: text('description'),
});

export const sections = sqliteTable('sections', {
  id: text('id').primaryKey(),
  store_id: text('store_id').references(() => stores.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

export const storeRows = sqliteTable('store_rows', {
  id: text('id').primaryKey(),
  section_id: text('section_id').references(() => sections.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
});

export const storeGaps = sqliteTable('store_gaps', {
  id: text('id').primaryKey(),
  row_id: text('row_id').references(() => storeRows.id).notNull(),
  name: text('name', { length: 100 }).notNull(),
  capacity: real('capacity'),
  notes: text('notes'),
});

export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  product_id: text('product_id').notNull().references(() => products.id),
  store_gap_id: text('store_gap_id').notNull().references(() => storeGaps.id),
  quantity: real('quantity').notNull(),
  min_quantity: real('min_quantity'),
  reorder_quantity: real('reorder_quantity'),
  last_count: text('last_count'),
});

export const inventoryMovements = sqliteTable('inventory_movements', {
  id: text('id').primaryKey(),
  type: text('type', { length: 50 }).notNull(),
  date: text('date').notNull(),
  user_id: text('user_id').references(() => users.id),
  reference: text('reference'),
  notes: text('notes'),
});

export const movementItems = sqliteTable('movement_items', {
  id: text('id').primaryKey(),
  movement_id: text('movement_id').notNull().references(() => inventoryMovements.id),
  inventory_id: text('inventory_id').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  order_number: text('order_number', { length: 50 }).notNull().unique(),
  supplier_id: text('supplier_id').notNull().references(() => suppliers.id),
  user_id: text('user_id').notNull().references(() => users.id),
  order_date: text('order_date').notNull(),
  status: text('status', { length: 50 }).notNull(),
  expected_arrival: text('expected_arrival'),
  notes: text('notes'),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  order_id: text('order_id').notNull().references(() => orders.id),
  product_id: text('product_id').notNull().references(() => products.id),
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  status: text('status'),
});

export const orderTracking = sqliteTable('order_tracking', {
  id: text('id').primaryKey(),
  order_id: text('order_id').notNull().references(() => orders.id),
  tracking_number: text('tracking_number'),
  carrier: text('carrier'),
  status: text('status'),
  updated_at: text('updated_at'),
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
  zone_id: text('zone_id').references(() => zones.id),
  installation_date: text('installation_date'),
  status: text('status', { length: 50 }),
});

export const incidents = sqliteTable('incidents', {
  id: text('id').primaryKey(),
  code: text('code', { length: 50 }).notNull().unique(),
  title: text('title', { length: 100 }).notNull(),
  description: text('description'),
  machine_id: text('machine_id').references(() => machinery.id),
  reported_by: text('reported_by').references(() => users.id),
  assigned_to: text('assigned_to').references(() => users.id),
  created_at: text('created_at'),
  due_date: text('due_date'),
  priority: text('priority'),
  status: text('status'),
  estimated_hours: real('estimated_hours'),
  actual_hours: real('actual_hours'),
});

export const incidentItems = sqliteTable('incident_items', {
  id: text('id').primaryKey(),
  incident_id: text('incident_id').notNull().references(() => incidents.id),
  inventory_id: text('inventory_id').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
});

export const incidentHistory = sqliteTable('incident_history', {
  id: text('id').primaryKey(),
  incident_id: text('incident_id').notNull().references(() => incidents.id),
  user_id: text('user_id').notNull().references(() => users.id),
  timestamp: text('timestamp').notNull(),
  action: text('action'),
  comments: text('comments'),
  status_from: text('status_from'),
  status_to: text('status_to'),
});
