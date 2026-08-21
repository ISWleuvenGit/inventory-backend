import { Inventory as InventoryPrisma } from '@prisma/client';
import { Item } from './item';

export class Inventory {
    private id?: number;
    private name: string;
    private description: string;
    private items: Item[] = [];
    private users?: any[];

    constructor(inventory: {
        id?: number;
        name: string;
        description: string;
        items?: Item[];
        users?: any[];
    }) {
        this.validate(inventory);

        this.id = inventory.id || 0;
        this.name = inventory.name;
        this.description = inventory.description;
        if (inventory.items) {
            this.items = inventory.items;
        }
        if (inventory.users) {
            this.users = inventory.users;
        }
    }

    getId(): number {
        if (this.id === undefined) {
            throw new Error('Inventory ID is undefined');
        }
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getItems(): Item[] {
        return this.items;
    }

    setItems(items: Item[]): void {
        this.items = items;
    }

    getUsers(): any[] {
        return this.users || [];
    }

    setUsers(users: any[]): void {
        this.users = users;
    }

    validate(inventory: {
        id?: number;
        name: string;
        description: string;
        items?: Item[];
        users?: any[];
    }) {
        if (!inventory.name) {
            throw new Error('Name is required');
        }
        if (inventory.name.length < 3) {
            throw new Error('Name must be at least 3 characters long');
        }
        if (!inventory.description) {
            throw new Error('Description is required');
        }
    }

    static from(inventoryPrisma: any): Inventory {
        const inventory = new Inventory({
            id: inventoryPrisma.id,
            name: inventoryPrisma.name,
            description: inventoryPrisma.description,
        });

        // Convert Prisma items to Item objects if they exist
        if (inventoryPrisma.items && Array.isArray(inventoryPrisma.items)) {
            const items = inventoryPrisma.items.map((itemPrisma: any) => Item.from(itemPrisma));
            inventory.setItems(items);
        }

        // Add users if they exist
        if (inventoryPrisma.users && Array.isArray(inventoryPrisma.users)) {
            inventory.setUsers(inventoryPrisma.users);
        }

        return inventory;
    }
}
