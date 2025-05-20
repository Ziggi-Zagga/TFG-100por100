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
  description?: string;
  supplierId?: string;
  manufacturerId?: string;
  categoryId?: string;
  price?: number;
  unit?: string;
  dimensions?: string;
  material?: string;
  specifications?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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