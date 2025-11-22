import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
    const { title, description, assignedToId } = req.body;
    const assignedById = req.user.id;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedToId,
                assignedById,
            },
            include: {
                assignedTo: { select: { name: true } },
            },
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Error creating task' });
    }
};

export const getTasksForManager = async (req, res) => {
    const managerId = req.user.id;

    try {
        const tasks = await prisma.task.findMany({
            where: { assignedById: managerId },
            include: { assignedTo: true },
        });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching tasks' });
    }
};

export const getTasksForWorker = async (req, res) => {
    const workerId = req.user.id;

    try {
        const tasks = await prisma.task.findMany({
            where: { assignedToId: workerId },
            include: {
                assignedBy: { select: { name: true } },
            },
        });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching tasks' });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await prisma.task.update({
            where: { id },
            data: { status },
        });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Error updating task status' });
    }
};
