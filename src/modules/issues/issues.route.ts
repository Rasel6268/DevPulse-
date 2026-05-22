import express from 'express';
import { authMiddleware } from '../../middleware/auth/auth.middleware';
import { createIssuesController, deleteIssueController, getIssuesByIdController, getIssuesController, updateIssueController } from './issues.controller';
import roleMiddleware from '../../middleware/roles/roleMiddleware';

const router = express.Router()

router.post('/create',authMiddleware, createIssuesController)
router.get('/',authMiddleware, roleMiddleware(["contributor", "maintainer"]),getIssuesController)
router.get('/:id',authMiddleware,getIssuesByIdController)
router.put('/update/:id',authMiddleware,roleMiddleware(["maintainer"]),updateIssueController)
router.delete('/:id',authMiddleware,roleMiddleware(["maintainer"]),deleteIssueController)


export default router