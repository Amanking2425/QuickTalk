import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"; 
import { connectDB } from "./lib/db.js";
dotenv.config(); // Load environment variables from .env file
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import cors from "cors";
import path from "path";


const app = express();
const PORT = process.env.PORT
const __dirname = path.resolve(); // Get the current directory name

app.use(cors({
    origin : ["http://localhost:5173","https://quicktlk.netlify.app"] // Allow requests from this originq
    //credentials: true, // Allow cookies to be sent with requests
}))
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/api/auth" , authRoutes); // Define a route for authentication
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

//for deploying in vercel
app.get('/',(req,res) =>{
    res.send({
        activeStatus : true,
        error:false,
    })
})

if(process.env.NODE_ENV === "production") {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));

    // Handle any requests that don't match the above routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
    });
}

app.listen(PORT, () =>{
    console.log(`Server is running on port 5001 ${PORT}`);
    connectDB();
})
