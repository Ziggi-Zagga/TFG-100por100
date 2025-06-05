import { db } from '$lib/server/db';
import { products, suppliers, manufacturers, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


export const getProductsBySupplier = async (supplierId: string) => {
	return await db
		.select({
			id: products.id,
			code: products.code,
			name: products.name,
			description: products.description,
			price: products.price,
			unit: products.unit,
			supplierId: suppliers.id,
			supplierName: suppliers.name,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(products)
		.leftJoin(suppliers, eq(suppliers.id, products.supplierId))
		.leftJoin(categories, eq(categories.id, products.categoryId))
		.where(eq(products.supplierId, supplierId));
};

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
      categoryParentId: categories.parentId,
    })
    .from(products)
    .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
    .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))

  
};

export const getAllProducts = async () => {
  return await db.select().from(products);
};

export const insertProduct = async ({
  id,
  code,
  name,
  description,
  supplierId,
  manufacturerId,
  categoryId,
  price,
  unit = '',
  dimensions,
  material,
  specifications,
  active = true,
  createdAt = new Date(),
  updatedAt = new Date(),
}: {
  id: string;
  name: string;
  code: string;
  description?: string;
  supplierId?: string;
  manufacturerId?: string;
  categoryId?: string;
  price?: number;
  unit?: string;
  dimensions?: string;
  material?: string;
  specifications?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  try {
    const productData = {
      id,
      code,
      name,
      description: description || undefined,
      price: price || 0,
      unit: unit || '',
      dimensions: dimensions || undefined,
      material: material || undefined,
      specifications: specifications || undefined,
      active: active !== undefined ? active : true,
      supplierId: supplierId || undefined,
      manufacturerId: manufacturerId || undefined,
      categoryId: categoryId || undefined,
    };
    
    // Añadir campos de auditoría solo si existen en el esquema
    const withTimestamps = {
      ...productData,
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt })
    };

    const [newProduct] = await db
      .insert(products)
      .values(withTimestamps)
      .returning();
    
    return newProduct;
  } catch (error) {
    console.error('Error al insertar el producto:', error);
    throw error;
  }
};

export const removeProduct = async (id: string) => {
	await db.delete(products).where(eq(products.id, id));
};

export const updateProduct = async ({
  id,
  code,
  name,
  description,
  supplierId,
  manufacturerId,
  categoryId,
  price,
  unit,
  dimensions,
  material,
  specifications,
  active,
  updatedAt,
}: {
  id: string;
  name: string;
  code: string;
  description?: string;
  supplierId?: string;
  manufacturerId?: string;
  categoryId?: string;
  price?: number;
  unit?: string;
  dimensions?: string;
  material?: string;
  specifications?: string;
  active?: boolean;
  updatedAt?: Date;
}) => {
  await db
    .update(products)
    .set({
      code,
      name,
      description: description ?? null,
      supplierId: supplierId ?? null,
      manufacturerId: manufacturerId ?? null,
      categoryId: categoryId ?? null,
      price: price || 0,
      unit: unit ?? '',
      dimensions: dimensions ?? null,
      material: material ?? null,
      specifications: specifications ?? null,
      active: active ?? true,
    })
    .where(eq(products.id, id));

  return {
    id,
    code,
    name,
    description,
    supplierId,
    manufacturerId,
    categoryId,
    price,
    unit,
    dimensions,
    material,
    specifications,
    active: active ?? true,
    updatedAt,
  };
};

export const repoGetProductById = async (id: string) => {
    return db.select().from(products).where(eq(products.id, id));
}


