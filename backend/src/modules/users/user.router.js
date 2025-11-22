import express from 'express';
import { getUsers } from './user.controller.js';
import { authenticate, authorize } from '../../core/middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('MANAGER'), getUsers);

export default router;
