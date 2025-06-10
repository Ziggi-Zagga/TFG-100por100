export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  notes?: string | null;
}

export interface Manufacturer {
  id: string;
  name: string;
  description?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  manufacturerId?: string | null;
  manufacturerName?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categoryDescription?: string | null;
  categoryParentId?: string | null;
  price?: number | null;
  unit?: string | null;
  dimensions?: string | null;
  material?: string | null;
  specifications?: string | null;
  active: boolean | null;
}

export interface ProductFormData {
  code: string;
  name: string;
  description?: string;
  supplierId: string;
  manufacturerId: string;
  categoryId: string;
  price: number;
  unit: string;
  dimensions?: string;
  material?: string;
  specifications?: string;
}