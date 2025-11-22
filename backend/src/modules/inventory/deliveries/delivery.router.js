import express from 'express';
import { z } from 'zod';
import {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  addDeliveryItem,
  updateDeliveryStatus,
  validateDelivery,
  deleteDeliveryItem,
} from './delivery.controller.js';
import { validate } from '../../../core/middlewares/validator.js';
import { authenticate } from '../../../core/middlewares/auth.js';

const router = express.Router();

const createDeliverySchema = z.object({
  body: z.object({
    customerName: z.string().min(1),
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

router.get('/', authenticate, getAllDeliveries);
router.get('/:id', authenticate, getDeliveryById);
router.post('/', authenticate, validate(createDeliverySchema), createDelivery);
router.post('/:id/items', authenticate, validate(addItemSchema), addDeliveryItem);
router.put('/:id/status', authenticate, validate(updateStatusSchema), updateDeliveryStatus);
router.post('/:id/validate', authenticate, validateDelivery);
router.delete('/:id/items/:itemId', authenticate, deleteDeliveryItem);

export default router;

