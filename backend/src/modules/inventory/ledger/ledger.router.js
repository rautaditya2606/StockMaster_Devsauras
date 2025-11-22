import express from 'express';
import {
  getLedgerEntries,
  getProductLedger,
  getWarehouseLedger,
} from './ledger.controller.js';
import { authenticate } from '../../../core/middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getLedgerEntries);
router.get('/product/:productId', authenticate, getProductLedger);
router.get('/warehouse/:warehouseId', authenticate, getWarehouseLedger);

export default router;

