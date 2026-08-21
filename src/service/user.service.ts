import userDB from '../repository/user.db.js';
import { User } from '../model/user.js';

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserById = async ({ id }: { id: string }): Promise<User> => {
    const user = await userDB.getUserById({ id });
    if (!user) {
        throw new Error(`User with ID: ${id} does not exist.`);
    }
    return user;
};

const getUserByName = async ({ name }: { name: string }): Promise<User> => {
    const user = await userDB.getUserByName({ name });
    if (!user) {
        throw new Error(`User with username: ${name} does not exist.`);
    }
    return user;
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User> => {
    const user = await userDB.getUserByEmail({ email });
    if (!user) {
        throw new Error(`User with email: ${email} does not exist.`);
    }
    return user;
};

export default {
    getAllUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
};
