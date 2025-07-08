import ApiError from '../utils/ApiError.js'
import User from "../modles/user.model.js"
import jwt from 'jsonwebtoken'
const verifyUser =async(req,res,next)=>{
    try {
        const token =req.cookies?.AccessToken
        if(!token) throw new ApiError(401,"unAuthorized request");
        const decodedToken =jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne(decodedToken._id).select("-password ")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user =user
        next()
    } catch (error) {
        res.status(401).json({
            "message":"unauthorized request"
        })
    }
}
export default verifyUser