import { InventoryUser as InventoryUserPrisma } from '@prisma/client';

export type InventoryRole = 'owner' | 'editor' | 'viewer';

export class InventoryUser {
    private id?: number;
    private userId: string;
    private inventoryId: number;
    private role: InventoryRole;
    private addedAt?: Date;

    constructor(inventoryUser: {
        id?: number;
        userId: string;
        inventoryId: number;
        role: InventoryRole;
        addedAt?: Date;
    }) {
        this.id = inventoryUser.id;
        this.userId = inventoryUser.userId;
        this.inventoryId = inventoryUser.inventoryId;
        this.role = inventoryUser.role;
        this.addedAt = inventoryUser.addedAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUserId(): string {
        return this.userId;
    }

    getInventoryId(): number {
        return this.inventoryId;
    }

    getRole(): InventoryRole {
        return this.role;
    }

    getAddedAt(): Date | undefined {
        return this.addedAt;
    }

    static from(data: InventoryUserPrisma): InventoryUser {
        return new InventoryUser({
            id: data.id,
            userId: data.userId,
            inventoryId: data.inventoryId,
            role: data.role as InventoryRole,
            addedAt: data.addedAt,
        });
    }
}
