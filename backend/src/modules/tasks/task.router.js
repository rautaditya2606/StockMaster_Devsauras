// src/modules/tasks/task.router.js
import express from 'express';
import { z } from 'zod';
import {
    createTask,
    getTasksForManager,
    getTasksForWorker,
    updateTaskStatus,
} from './task.controller.js';
import { validate } from '../../core/middlewares/validator.js';
import { authenticate, authorize } from '../../core/middlewares/auth.js';

const router = express.Router();

// Validation schemas
const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        assignedToId: z.string().min(1),
    }),
});

const updateStatusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'ONGOING', 'COMPLETED']),
    }),
});

// Manager creates a task
router.post(
    '/',
    authenticate,
    authorize('MANAGER'),
    validate(createTaskSchema),
    createTask
);

// Manager fetches tasks they created
router.get(
    '/manager',
    authenticate,
    authorize('MANAGER'),
    getTasksForManager
);

// Worker fetches tasks assigned to them
router.get(
    '/worker',
    authenticate,
    authorize('WAREHOUSE_STAFF'),
    getTasksForWorker
);

// Worker updates task status
router.patch(
    '/:id/status',
    authenticate,
    authorize('WAREHOUSE_STAFF'),
    validate(updateStatusSchema),
    updateTaskStatus
);

export default router;
