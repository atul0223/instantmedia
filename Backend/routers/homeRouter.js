import Router from 'express';
import verifyUser from '../middleware/auth.middleware.js';
import { homePage } from '../controllers/homePage.controller.js';

const router = Router();

router.route('/').get(verifyUser, homePage);

export default router;
