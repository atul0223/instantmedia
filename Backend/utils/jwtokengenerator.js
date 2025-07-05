import jwt from 'jsonwebtoken'
const generateJWT = (user)=>{
    jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET, { expiresIn: '1h' });

}
export default generateJWT