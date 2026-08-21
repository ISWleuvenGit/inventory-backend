import { Item as ItemPrisma, Prisma, PriceVariable as PriceVariablePrisma } from '@prisma/client';
import { BaseModel } from './base.model';
import { PriceVariable } from './priceVariable';

export class Item extends BaseModel {
    private name: string;
    private description: string;
    private buyPrice: Prisma.Decimal;
    private buyedAt?: Date;
    private inventoryId?: number;
    private priceVariables?: PriceVariable[]; // ADD THIS

    constructor(item: {
        id?: number;
        name: string;
        description: string;
        buyPrice: Prisma.Decimal | number;
        quantity: number;
        buyedAt?: Date;
        createdAt?: Date;
        inventoryId?: number;
        priceVariables?: PriceVariable[]; // ADD THIS
    }) {
        super({
            id: item.id,
            quantity: item.quantity,
            createdAt: item.createdAt,
        });
        this.validate(item);
        this.name = item.name;
        this.description = item.description;
        this.buyPrice =
            typeof item.buyPrice === 'number' ? new Prisma.Decimal(item.buyPrice) : item.buyPrice;
        this.buyedAt = item.buyedAt;
        this.inventoryId = item.inventoryId;
        this.priceVariables = item.priceVariables; // ADD THIS
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getBuyPrice(): Prisma.Decimal {
        return this.buyPrice;
    }

    getBuyPriceAsNumber(): number {
        return this.buyPrice.toNumber();
    }

    getBuyedAt(): Date | undefined {
        return this.buyedAt;
    }

    getInventoryId(): number | undefined {
        return this.inventoryId;
    }

    // ADD THIS
    getPriceVariables(): PriceVariable[] | undefined {
        return this.priceVariables;
    }

    validate(item: {
        id?: number;
        name: string;
        description: string;
        buyPrice: Prisma.Decimal | number;
        quantity: number;
        buyedAt?: Date;
        createdAt?: Date;
    }) {
        if (!item.name) {
            throw new Error('Name is required');
        }
        if (item.name.length < 3) {
            throw new Error('Name must be at least 3 characters long');
        }
        if (!item.description) {
            throw new Error('Description is required');
        }
        if (item.buyPrice === undefined || item.buyPrice === null) {
            throw new Error('Buy price is required');
        }
        const price = typeof item.buyPrice === 'number' ? item.buyPrice : item.buyPrice.toNumber();
        if (price < 0) {
            throw new Error('Buy price must be a positive number');
        }
    }

    static from(itemPrisma: ItemPrisma & { priceVariables?: PriceVariablePrisma[] }): Item {
        return new Item({
            id: itemPrisma.id,
            name: itemPrisma.name,
            description: itemPrisma.description,
            buyPrice: itemPrisma.buyPrice,
            quantity: itemPrisma.quantity,
            buyedAt: itemPrisma.buyedAt || undefined,
            createdAt: itemPrisma.createdAt,
            inventoryId: itemPrisma.inventoryId || undefined,
            priceVariables: itemPrisma.priceVariables?.map((pv) => PriceVariable.from(pv)),
        });
    }
}
