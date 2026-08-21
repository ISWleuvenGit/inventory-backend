import { Item } from '../model/item';

export interface ItemDTO {
    id: number;
    name: string;
    description: string;
    buyPrice: string;
    quantity: number;
    buyedAt: string | null;
    inventoryId: number | null;
    priceVariables?: PriceVariableDTO[];
    createdAt: string;
    updatedAt: string | null;
}

export interface PriceVariableDTO {
    id: number;
    name: string;
    value: string;
    type: 'PERCENTAGE' | 'FIXED';
    isDefault: boolean;
    itemId: number;
    createdAt: string;
    updatedAt: string | null;
}

export function itemToDTO(item: Item | any): ItemDTO {
    const buyPrice = (item as any).getBuyPrice
        ? (item as any).getBuyPrice()
        : (item as any).buyPrice;
    const quantity = (item as any).getQuantity
        ? (item as any).getQuantity()
        : (item as any).quantity;
    const buyedAt = (item as any).getBuyedAt?.() ?? (item as any).buyedAt ?? null;
    const createdAt = (item as any).getCreatedAt?.() ?? (item as any).createdAt ?? new Date();
    const updatedAt = (item as any).getUpdatedAt?.() ?? (item as any).updatedAt ?? null;
    const inventoryIdRaw = (item as any).getInventoryId
        ? (item as any).getInventoryId()
        : (item as any).inventoryId;

    return {
        id: (item as any).getId ? (item as any).getId() : (item as any).id,
        name: (item as any).getName ? (item as any).getName() : (item as any).name,
        description: (item as any).getDescription
            ? (item as any).getDescription()
            : (item as any).description,
        buyPrice: buyPrice?.toString?.() || String(buyPrice),
        quantity: Number(quantity) || 0,
        buyedAt:
            buyedAt instanceof Date
                ? buyedAt.toISOString()
                : buyedAt
                  ? new Date(buyedAt).toISOString()
                  : null,
        inventoryId: typeof inventoryIdRaw === 'number' ? inventoryIdRaw : null,
        priceVariables:
            (item as any).getPriceVariables?.()?.map((pv: any) => ({
                id: pv.getId ? pv.getId() : pv.id,
                name: pv.getName ? pv.getName() : pv.name,
                value: (pv.getValue ? pv.getValue() : pv.value)?.toString?.() || String(pv.value),
                type: (pv.getType ? pv.getType() : pv.type) as 'PERCENTAGE' | 'FIXED',
                isDefault: pv.getIsDefault ? pv.getIsDefault() : !!pv.isDefault,
                itemId: pv.getItemId ? pv.getItemId() : pv.itemId,
                createdAt:
                    (pv.getCreatedAt?.() ?? pv.createdAt ?? new Date()).toISOString?.() ||
                    new Date().toISOString(),
                updatedAt: (pv.getUpdatedAt?.() ?? pv.updatedAt ?? null)?.toISOString?.() || null,
            })) ?? [],
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt),
        updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : null,
    };
}

export function itemsToDTO(items: Array<Item | any>): ItemDTO[] {
    return items.map(itemToDTO);
}

export function validateItemInput(data: any): {
    name: string;
    description: string;
    buyPrice: number;
    quantity: number;
    buyedAt?: Date;
    inventoryId?: number;
} {
    if (!data.name || typeof data.name !== 'string') {
        throw new Error('Item name is required and must be a string');
    }
    if (typeof data.description !== 'string') {
        throw new Error('Item description must be a string');
    }
    const buyPrice = Number(data.buyPrice);
    if (isNaN(buyPrice) || buyPrice < 0) {
        throw new Error('Buy price must be a positive number');
    }
    const quantity = Number(data.quantity);
    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
        throw new Error('Quantity must be a non-negative integer');
    }
    return {
        name: data.name.trim(),
        description: data.description.trim(),
        buyPrice,
        quantity,
        buyedAt: data.buyedAt ? new Date(data.buyedAt) : undefined,
        inventoryId: data.inventoryId ? Number(data.inventoryId) : undefined,
    };
}
