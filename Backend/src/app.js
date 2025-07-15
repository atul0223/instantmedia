import express,{json, urlencoded } from 'express'
import cookieParser from "cookie-parser"
import userRouter from '../routers/userRouter.js'
import cors from "cors"
import profileRouter from '../routers/profileRouter.js'
import homeRouter from '../routers/homeRouter.js'
const app = express()
app.use(cors( { origin:"http://localhost:5173"
 }));
app.use(json({ limit: "20kb" }));
app.use(urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/user",userRouter)
app.use("/profile",profileRouter)
app.use("/home",homeRouter)
app.use(express.json)
export default app
