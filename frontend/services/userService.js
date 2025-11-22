import { usersAPI } from './api';

export const getUsers = async () => {
    const response = await usersAPI.getAll();
    return response.data;
};
