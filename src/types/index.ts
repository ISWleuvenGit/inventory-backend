export type Role = 'admin' | 'user' | 'guest';

export type UserInput = {
    id?: string;
    email: string;
    password?: string;
    name: string;
    age?: number;
    role?: Role;
};

export type AuthenticationResponse = {
    token: string;
    email: string;
    role: Role;
    username: string;
};

export type LoginInput = {
    email: string;
    password: string;
};
