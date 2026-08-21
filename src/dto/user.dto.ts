import { User } from '../model/user.js';

export type UserDTO = {
    id: string;
    name: string;
    email: string;
    role?: string;
    age?: number;
};

export const userToDTO = (user: User): UserDTO => ({
    id: user.getId(),
    name: user.getName(),
    email: user.getEmail(),
    role: user.getRole(),
    age: user.getAge(),
});

export const usersToDTO = (users: User[]): UserDTO[] => users.map(userToDTO);
