import Router from 'express';
import { verifyUser } from '../middlewares/verifyUser.js';
import { homePage } from '../controllers/homePage.controller.js';

const router = Router();

router.route('/home').get(verifyUser, homePage);

export default router;
