import { PriceVariable as PriceVariablePrisma } from '@prisma/client';

export class PriceVariable {
    private id?: number;
    private name: string;
    private value: number; // ← ADD THIS
    private type: string; // ← ADD THIS
    private isDefault: boolean; // ← ADD THIS
    private itemId: number;

    constructor(priceVariable: {
        id?: number;
        name: string;
        value: number; // ← ADD THIS
        type: string; // ← ADD THIS
        isDefault: boolean; // ← ADD THIS
        itemId: number;
    }) {
        this.validate(priceVariable);
        this.id = priceVariable.id;
        this.name = priceVariable.name;
        this.value = priceVariable.value; // ← ADD THIS
        this.type = priceVariable.type; // ← ADD THIS
        this.isDefault = priceVariable.isDefault; // ← ADD THIS
        this.itemId = priceVariable.itemId;
    }

    getId(): number {
        if (this.id === undefined) {
            throw new Error('PriceVariable ID is undefined');
        }
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getValue(): number {
        // ← ADD THIS
        return this.value;
    }

    getType(): string {
        // ← ADD THIS
        return this.type;
    }

    getIsDefault(): boolean {
        // ← ADD THIS
        return this.isDefault;
    }

    getItemId(): number {
        return this.itemId;
    }

    validate(priceVariable: {
        name: string;
        value: number; // ← ADD THIS
        type: string; // ← ADD THIS
        itemId: number;
    }) {
        if (!priceVariable.name?.trim()) {
            throw new Error('Price variable name is required');
        }
        if (priceVariable.name.length < 2) {
            throw new Error('Price variable name must be at least 2 characters long');
        }
        if (priceVariable.value === undefined || priceVariable.value === null) {
            // ← ADD THIS
            throw new Error('Value is required');
        }
        if (!['PERCENTAGE', 'FIXED'].includes(priceVariable.type)) {
            // ← ADD THIS
            throw new Error('Type must be either PERCENTAGE or FIXED');
        }
        if (!priceVariable.itemId) {
            throw new Error('Item ID is required'); // Changed from 'Inventory ID is required'
        }
    }

    equals(priceVariable: PriceVariable): boolean {
        return this.name === priceVariable.getName() && this.itemId === priceVariable.getItemId();
    }

    static from(priceVariablePrisma: PriceVariablePrisma): PriceVariable {
        return new PriceVariable({
            id: priceVariablePrisma.id,
            name: priceVariablePrisma.name,
            value: priceVariablePrisma.value, // ← ADD THIS
            type: priceVariablePrisma.type, // ← ADD THIS
            isDefault: priceVariablePrisma.isDefault, // ← ADD THIS
            itemId: priceVariablePrisma.itemId,
        });
    }
}
