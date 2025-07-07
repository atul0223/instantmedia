import jwt from "jsonwebtoken";
const generateJWT = (user, time) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: time }
  );
};
export default generateJWT;
