export abstract class BaseModel {
    protected id?: number;
    protected quantity: number;
    protected createdAt: Date;

    constructor(entity: { id?: number; quantity: number; createdAt?: Date }) {
        this.id = entity.id || 0;
        this.quantity = entity.quantity;
        this.createdAt = entity.createdAt || new Date();
        this.validateQuantity(entity.quantity);
    }

    getId(): number {
        if (this.id === undefined) {
            throw new Error('Entity ID is undefined');
        }
        return this.id;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    protected validateQuantity(quantity: number): void {
        if (quantity === undefined || quantity === null) {
            throw new Error('Quantity is required');
        }
    }

    protected abstract validate(entity: any): void;
}
