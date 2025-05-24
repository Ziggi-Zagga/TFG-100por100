export interface InventoryItem {
    id: string;
    productId: string;
    storeGapId: string;
    quantity: number;
    minQuantity: number;
    reorderQuantity: number;
    lastCount: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Store {
    id: string;
    name: string;
    location: string;
    description?: string;
}

export interface Section {
    id: string;
    storeId: string;
    name: string;
    description?: string;
}

export interface StoreRow {
    id: string;
    sectionId: string;
    name: string;
    description?: string;
}

export interface StoreGap {
    id: string;
    rowId: string;
    name: string;
    capacity: number;
    notes: string;
}

