import Router from 'express';
import verifyUser from '../middleware/auth.middleware.js';
import { homePage } from '../controllers/homePage.controller.js';
import User from '../modles/user.model.js';
const router = Router();

router.route('/').get(verifyUser, homePage);
router.route('/search').get( async(req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } }
            ]
        }).select('-passwordSchema -refreshToken -verificationEmailToken -isVerified -trustDevice -otp -createdAt -updatedAt -__v -trustedDevices');
        
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
