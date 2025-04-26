// import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// export const users = sqliteTable('users', {
//   id: text('id').primaryKey(),
//   email: text('email').notNull().unique(),
//   password: text('password').notNull(),
// });

import { sqliteTable, text, integer, primaryKey, real, foreignKey } from 'drizzle-orm/sqlite-core';

// ROLES
export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  permissions: text('permissions', { length: 1000 }),
});

// USERS
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username', { length: 50 }).notNull().unique(),
  password_hash: text('password_hash', { length: 128 }).notNull(),
  salt: text('salt', { length: 128 }).notNull(),
  email: text('email', { length: 255 }).notNull().unique(),
  full_name: text('full_name', { length: 100 }).notNull(),
  active: integer('active', { mode: 'boolean' }).notNull(),
  created_at: text('created_at').notNull(),
  last_login: text('last_login'),
  rol: integer("roles_id").references(() => roles.id),
});

// USER_SESSIONS
export const userSessions = sqliteTable('user_sessions', {
  session_id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => users.id),
  session_token: text('session_token', { length: 128 }).notNull().unique(),
  created_at: text('created_at').notNull(),
  expires_at: text('expires_at').notNull(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
});

// SUPPLIERS
export const suppliers = sqliteTable('suppliers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  contact_person: text('contact_person'),
  email: text('email', { length: 255 }),
  phone: text('phone'),
  website: text('website'),
  notes: text('notes'),
});

// MANUFACTURERS
export const manufacturers = sqliteTable('manufacturers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

// CATEGORIES
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  parent_id: integer('parent_id'),
}, (table) => ({
  parentCategoryFk: foreignKey({
    columns: [table.parent_id],
    foreignColumns: [table.id],
  }),
}));

// PRODUCTS
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code', { length: 50 }).notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  supplier_id: integer('supplier_id').references(() => suppliers.id),
  manufacturer_id: integer('manufacturer_id').references(() => manufacturers.id),
  category_id: integer('category_id').references(() => categories.id),
  price: real('price'),
  unit: text('unit', { length: 20 }),
  dimensions: text('dimensions'),
  material: text('material'),
  specifications: text('specifications'),
  active: integer('active', { mode: 'boolean' }).notNull(),
});

// INVENTORY
export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  product_id: integer('product_id').notNull().references(() =>products.id),
  location_id: integer('location_id').notNull().references(() => inventoryLocations.id),
  quantity: real('quantity').notNull(),
  min_quantity: real('min_quantity'),
  reorder_quantity: real('reorder_quantity'),
  last_count: text('last_count'),
});

// INVENTORY_LOCATIONS
export const inventoryLocations = sqliteTable('inventory_locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
  zone: text('zone'),
});

// INVENTORY_MOVEMENTS
export const inventoryMovements = sqliteTable('inventory_movements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { length: 50 }).notNull(),
  date: text('date').notNull(),
  user_id: integer('user_id').references(() => users.id),
  reference: text('reference'),
  notes: text('notes'),
});

// MOVEMENT_ITEMS
export const movementItems = sqliteTable('movement_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movement_id: integer('movement_id').notNull().references(() => inventoryMovements.id),
  inventory_id: integer('inventory_id').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
});

// ORDERS
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_number: text('order_number', { length: 50 }).notNull().unique(),
  supplier_id: integer('supplier_id').notNull().references(() => suppliers.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  order_date: text('order_date').notNull(),
  status: text('status', { length: 50 }).notNull(),
  expected_arrival: text('expected_arrival'),
  notes: text('notes'),
});

// ORDER_ITEMS
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_id: integer('order_id').notNull().references(() => orders.id),
  product_id: integer('product_id').notNull().references(() => products.id),
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  status: text('status'),
});

// ORDER_TRACKING
export const orderTracking = sqliteTable('order_tracking', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_id: integer('order_id').notNull().references(() => orders.id),
  tracking_number: text('tracking_number'),
  carrier: text('carrier'),
  status: text('status'),
  updated_at: text('updated_at'),
});

// ZONES
export const zones = sqliteTable('zones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 100 }).notNull(),
  description: text('description'),
});

// MACHINERY
export const machinery = sqliteTable('machinery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code', { length: 50 }).notNull().unique(),
  name: text('name', { length: 100 }).notNull(),
  model: text('model'),
  zone_id: integer('zone_id').references(() => zones.id),
  installation_date: text('installation_date'),
  status: text('status', { length: 50 }),
});

// INCIDENTS
export const incidents = sqliteTable('incidents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code', { length: 50 }).notNull().unique(),
  title: text('title', { length: 100 }).notNull(),
  description: text('description'),
  machine_id: integer('machine_id').references(() => machinery.id),
  reported_by: integer('reported_by').references(() => users.id),
  assigned_to: integer('assigned_to').references(() => users.id),
  created_at: text('created_at'),
  due_date: text('due_date'),
  priority: text('priority'),
  status: text('status'),
  estimated_hours: real('estimated_hours'),
  actual_hours: real('actual_hours'),
});

// INCIDENT_ITEMS
export const incidentItems = sqliteTable('incident_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  incident_id: integer('incident_id').notNull().references(() => incidents.id),
  inventory_id: integer('inventory_id').notNull().references(() => inventory.id),
  quantity: real('quantity').notNull(),
});

// INCIDENT_HISTORY
export const incidentHistory = sqliteTable('incident_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  incident_id: integer('incident_id').notNull().references(() => incidents.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  timestamp: text('timestamp').notNull(),
  action: text('action'),
  comments: text('comments'),
  status_from: text('status_from'),
  status_to: text('status_to'),
});

