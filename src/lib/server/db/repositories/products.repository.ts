import { db } from '$lib/server/db';
import { products, suppliers, manufacturers, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getFullProductsList = async () => {
  return await db
    .select({
      productId: products.id,
      productCode: products.code,
      productName: products.name,
      productDescription: products.description,
      productPrice: products.price,
      productUnit: products.unit,
      productDimensions: products.dimensions,
      productMaterial: products.material,
      productSpecifications: products.specifications,
      productActive: products.active,

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