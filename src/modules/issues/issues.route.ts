import express from 'express';
import { authMiddleware } from '../../middleware/auth/auth.middleware';
import { createIssuesController, getIssuesByIdController, getIssuesController } from './issues.controller';
import roleMiddleware from '../../middleware/roles/roleMiddleware';

const router = express.Router()

router.post('/create',authMiddleware, createIssuesController)
router.get('/',authMiddleware, roleMiddleware(["contributor", "maintainer"]),getIssuesController)
router.get('/:id',authMiddleware,getIssuesByIdController)


export default router