import type { User as UserPrisma } from '@prisma/client';
import type { Role } from '../types/index.js';

export class User {
    private id?: string;
    private name: string;
    private email: string;
    private role?: Role;
    private age?: number;

    constructor(user: { id?: string; email: string; name: string; age?: number; role?: Role }) {
        this.validate(user);
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
    }

    getId(): string {
        if (this.id === undefined) {
            throw new Error('User ID is undefined');
        }
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAge(): number | undefined {
        return this.age;
    }

    getRole(): Role | undefined {
        return this.role;
    }

    validate(user: { id?: string; name: string; email: string; role?: Role; age?: number }) {
        if (!user.name?.trim()) {
            throw new Error('Username is required');
        }

        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.name === user.getName() &&
            this.email === user.getEmail() &&
            this.role === user.getRole() &&
            this.age === user.getAge()
        );
    }

    static from({ id, email, name, role, age }: UserPrisma): User {
        return new User({
            id,
            email,
            name: name ?? 'User',
            role: role ? (role as Role) : undefined,
            age: age ?? undefined,
        });
    }
}
