import dotenv from 'dotenv'
import app from './app.js'
import connection from '../dataBase/dbConnection.js'
dotenv.config({
    path:'./.env'
})
const port = process.env.PORT
connection().then(()=>{
    try {
    app.listen(port)
    console.log("listning on port",port)
} catch (error) {
    throw new Error("Error while listning");   
}
})



