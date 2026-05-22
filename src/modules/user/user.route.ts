import express from 'express';
import { getAllUserController, loginUserController, registerUserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth/auth.middleware';
const router = express.Router();

router.post('/signup', registerUserController);
router.post('/login', loginUserController);
router.get('/',authMiddleware, getAllUserController);

export default router;