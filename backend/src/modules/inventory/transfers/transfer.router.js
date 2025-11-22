import express from 'express';
import { z } from 'zod';
import {
  getAllTransfers,
  getTransferById,
  createTransfer,
  addTransferItem,
  updateTransferStatus,
  validateTransfer,
  deleteTransferItem,
} from './transfer.controller.js';
import { validate } from '../../../core/middlewares/validator.js';
import { authenticate } from '../../../core/middlewares/auth.js';

const router = express.Router();

const createTransferSchema = z.object({
  body: z.object({
    fromWarehouseId: z.string().min(1),
    toWarehouseId: z.string().min(1),
  }),
});

const addItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED']),
  }),
});

router.get('/', authenticate, getAllTransfers);
router.get('/:id', authenticate, getTransferById);
router.post('/', authenticate, validate(createTransferSchema), createTransfer);
router.post('/:id/items', authenticate, validate(addItemSchema), addTransferItem);
router.put('/:id/status', authenticate, validate(updateStatusSchema), updateTransferStatus);
router.post('/:id/validate', authenticate, validateTransfer);
router.delete('/:id/items/:itemId', authenticate, deleteTransferItem);

export default router;

