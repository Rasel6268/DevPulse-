import express from 'express';
import { authMiddleware } from '../../middleware/auth/auth.middleware';
import { createIssuesController, getIssuesController } from './issues.controller';
import roleMiddleware from '../../middleware/roles/roleMiddleware';

const router = express.Router()

router.post('/create',authMiddleware, createIssuesController)
router.get('/',authMiddleware, roleMiddleware(["contributor", "maintainer"]),getIssuesController)


export default router