import { Inventory } from '../model/inventory';

export interface InventoryDTO {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
    userRole?: 'owner' | 'editor' | 'viewer';
    userCount?: number;
    itemCount?: number;
    totalValue?: string;
}

export interface InventoryUserDTO {
    userId: string;
    inventoryId: number;
    role: 'owner' | 'editor' | 'viewer';
    user?: { id: string; name: string; email: string };
    joinedAt: string;
}

export function inventoryToDTO(
    inventory: Inventory | any,
    userRole?: string,
    additionalData?: { userCount?: number; itemCount?: number; totalValue?: number },
): InventoryDTO {
    const createdAt =
        (inventory as any).getCreatedAt?.() ?? (inventory as any).createdAt ?? new Date();
    const updatedAt = (inventory as any).getUpdatedAt?.() ?? (inventory as any).updatedAt ?? null;

    const dto: InventoryDTO = {
        id: (inventory as any).getId ? (inventory as any).getId() : (inventory as any).id,
        name: (inventory as any).getName ? (inventory as any).getName() : (inventory as any).name,
        description: (inventory as any).getDescription
            ? (inventory as any).getDescription()
            : (inventory as any).description,
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : String(createdAt),
        updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : null,
    };

    if (userRole) dto.userRole = userRole as any;
    if (additionalData) {
        if (additionalData.userCount !== undefined) dto.userCount = additionalData.userCount;
        if (additionalData.itemCount !== undefined) dto.itemCount = additionalData.itemCount;
        if (additionalData.totalValue !== undefined)
            dto.totalValue = additionalData.totalValue.toFixed(2);
    }

    return dto;
}

export function inventoriesToDTO(
    inventories: Array<Inventory | any>,
    userRoles?: Record<number, string>,
    additionalData?: Record<
        number,
        { userCount?: number; itemCount?: number; totalValue?: number }
    >,
): InventoryDTO[] {
    return inventories.map((inv) =>
        inventoryToDTO(
            inv,
            userRoles?.[(inv as any).getId?.() ?? (inv as any).id],
            additionalData?.[(inv as any).getId?.() ?? (inv as any).id],
        ),
    );
}

export function validateInventoryInput(data: any): { name: string; description: string } {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
        throw new Error('Inventory name is required and must be at least 3 characters');
    }
    if (!data.description || typeof data.description !== 'string') {
        throw new Error('Inventory description is required');
    }
    return { name: data.name.trim(), description: data.description.trim() };
}

export function inventoryUserToDTO(inventoryUser: any): InventoryUserDTO {
    const joinedAt = inventoryUser.createdAt ?? new Date();
    return {
        userId: inventoryUser.userId,
        inventoryId: inventoryUser.inventoryId,
        role: inventoryUser.role,
        user: inventoryUser.user
            ? {
                  id: inventoryUser.user.id,
                  name: inventoryUser.user.name,
                  email: inventoryUser.user.email,
              }
            : undefined,
        joinedAt:
            joinedAt instanceof Date ? joinedAt.toISOString() : new Date(joinedAt).toISOString(),
    };
}
