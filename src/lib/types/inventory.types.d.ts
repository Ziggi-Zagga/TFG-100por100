export interface InventoryItem {
	id: string;
	productId: string;
	warehouseGapId: string;
	quantity: number;
	minQuantity: number;
	reorderQuantity: number;
	lastCount: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface warehouse {
	id: string;
	name: string;
	location: string;
	description?: string;
}

export interface Section {
	id: string;
	warehouseId: string;
	name: string;
	description?: string;
}

export interface warehouseRow {
	id: string;
	sectionId: string;
	name: string;
	description?: string;
}

export interface warehouseGap {
	id: string;
	rowId: string;
	name: string;
	capacity: number;
	notes: string;
}
