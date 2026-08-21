import { prisma } from '../lib/prisma.js';
import { User } from '../model/user.js';

const getAllUsers = async (): Promise<User[]> => {
    const users = await prisma.user.findMany();
    return users.map((user) => User.from(user));
};

const getUserById = async ({ id }: { id: string }): Promise<User | null> => {
    const userPrisma = await prisma.user.findUnique({
        where: { id },
    });
    return userPrisma ? User.from(userPrisma) : null;
};

const getUserByName = async ({ name }: { name: string }): Promise<User | null> => {
    const userPrisma = await prisma.user.findFirst({
        where: { name },
    });
    return userPrisma ? User.from(userPrisma) : null;
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    const userPrisma = await prisma.user.findUnique({
        where: { email },
    });
    return userPrisma ? User.from(userPrisma) : null;
};

export default {
    getAllUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
};
