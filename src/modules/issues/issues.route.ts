import express from 'express';
import { authMiddleware } from '../../middleware/auth/auth.middleware';
import { createIssuesController } from './issues.controller';

const router = express.Router()

router.post('/create',authMiddleware, createIssuesController)


export default router