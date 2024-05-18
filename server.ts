import {app} from "./app";
import connectDB from "./utils/db";
import http from 'http';
import {v2 as cloudinary} from "cloudinary";
import { initSocketServer } from "./socketServer";
require("dotenv").config();
const server=http.createServer(app);
// Cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
});

initSocketServer(server);

// Create Server
server.listen(process.env.PORT,()=>{
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB();
})
