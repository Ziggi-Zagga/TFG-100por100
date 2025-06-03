export interface Warehouse {
  id: string;
  name: string;
  location?: string | null;
  description?: string | null;
}

export interface Section {
  id: string;
  warehouseId: string;
  name: string;
  location?: string | null;
  description?: string | null;
}

export interface WarehouseRow {
  id: string;
  sectionId: string;
  name: string;
  location?: string | null;
  description?: string | null;
}

export interface WarehouseGap {
  id: string;
  rowId: string;
  name: string;
  location?: string | null;
  description?: string | null;
  capacity?: number | null;
  notes?: string | null;
}

