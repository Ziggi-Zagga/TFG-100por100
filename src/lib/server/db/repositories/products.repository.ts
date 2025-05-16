import { db } from '$lib/server/db';
import { products, suppliers, manufacturers, categories } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const getFullProductsList = async () => {
  return await db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      dimensions: products.dimensions,
      material: products.material,
      specifications: products.specifications,
      active: products.active,

      supplierId: suppliers.id,
      supplierName: suppliers.name,

      manufacturerId: manufacturers.id,
      manufacturerName: manufacturers.name,

      categoryId: categories.id,
      categoryName: categories.name,
      categoryDescription: categories.description,
      categoryParentId: categories.parent_id,
    })
    .from(products)
    .leftJoin(suppliers, eq(suppliers.id, products.supplier_id))
    .leftJoin(manufacturers, eq(manufacturers.id, products.manufacturer_id))
    .leftJoin(categories, eq(categories.id, products.category_id));
};

export const getAllProducts = async () => {
  return await db.select().from(products);
};

export const insertProduct = async ({
  id,
  code,
  name,
  description,
  supplier_id,
  manufacturer_id,
  category_id,
  price,
  unit,
  dimensions,
  material,
  specifications,
  active,
}: {
  id: string;
  name: string;
  code: string;
  description?: string;
  supplier_id?: string;
  manufacturer_id?: string;
  category_id?: string;
  price?: number;
  unit?: string;
  dimensions?: string;
  material?: string;
  specifications?: string;
  active?: boolean;
}) => {
  await db.insert(products).values({
    id,
    code,
    name,
    description: description ?? null,
    supplier_id: supplier_id ?? null,
    manufacturer_id: manufacturer_id ?? null,
    category_id: category_id ?? null,
    price: price ?? null,
    unit: unit ?? null,
    dimensions: dimensions ?? null,
    material: material ?? null,
    specifications: specifications ?? null,
    active: active ?? false, 
  });

  return {
    id,
    code,
    name,
    description,
    supplier_id,
    manufacturer_id,
    category_id,
    price,
    unit,
    dimensions,
    material,
    specifications,
    active: active ?? false,
  };
};

