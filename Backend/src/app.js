import express,{json, urlencoded } from 'express'
import cookieParser from "cookie-parser"

import cors from "cors"
const app = express()
app.use(cors({ origin: process.env.ORIGIN }));
app.use(json({ limit: "20kb" }));
app.use(urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/user",userRouter)
export default app
