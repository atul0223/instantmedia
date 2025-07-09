import ApiError from '../utils/ApiError.js'
import User from "../modles/user.model.js"
import jwt from 'jsonwebtoken'
const verifyUser =async(req,res,next)=>{
    try {
        const token =req.cookies?.AccessToken
        if(!token) throw new ApiError(401,"unAuthorized request");
        const decodedToken =jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decodedToken.id })
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user =user
        next()
    } catch (error) {
        console.error("Verification error:", error)
    }
}
export default verifyUser