import { tasksAPI } from './api';

export const createTask = async (taskData) => {
    const response = await tasksAPI.create(taskData);
    return response.data;
};

export const getTasksForManager = async () => {
    const response = await tasksAPI.getForManager();
    return response.data;
};

export const getTasksForWorker = async () => {
    const response = await tasksAPI.getForWorker();
    return response.data;
};

export const updateTaskStatus = async (id, status) => {
    const response = await tasksAPI.updateStatus(id, status);
    return response.data;
};
