import dotenv from 'dotenv'
import app from './app.js'
import https from 'node:https';

import fs from 'fs'
import connection from '../dataBase/dbConnection.js'
dotenv.config({
    path:'./.env'
})
const port = process.env.PORT
connection().then(()=>{
   const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on https://localhost:${port}`);
});

})



