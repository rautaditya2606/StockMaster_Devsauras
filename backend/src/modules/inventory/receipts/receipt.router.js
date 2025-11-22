import express from 'express';
import { z } from 'zod';
import {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  addReceiptItem,
  updateReceiptStatus,
  validateReceipt,
  deleteReceiptItem,
} from './receipt.controller.js';
import { validate } from '../../../core/middlewares/validator.js';
import { authenticate } from '../../../core/middlewares/auth.js';

const router = express.Router();

const createReceiptSchema = z.object({
  body: z.object({
    supplierName: z.string().min(1),
    warehouseId: z.string().min(1),
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

router.get('/', authenticate, getAllReceipts);
router.get('/:id', authenticate, getReceiptById);
router.post('/', authenticate, validate(createReceiptSchema), createReceipt);
router.post('/:id/items', authenticate, validate(addItemSchema), addReceiptItem);
router.put('/:id/status', authenticate, validate(updateStatusSchema), updateReceiptStatus);
router.post('/:id/validate', authenticate, validateReceipt);
router.delete('/:id/items/:itemId', authenticate, deleteReceiptItem);

export default router;

