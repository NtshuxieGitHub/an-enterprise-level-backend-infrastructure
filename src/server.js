// Import necessary modules
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import cors from "cors";

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Get the file path form the url of the current module
const fileName = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const dirName = dirname(fileName);

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Frontend URL
  })
);
app.use(express.json());

/* 
Serve the HTML file from the /public directory and also tells 
express to serve all files from the public folder as static assets.
This is important as any requests for the css files will be resolved to 
the public directory. 
*/
app.use(express.static(path.join(dirName, "../public")));

// Serve the index.html file from the /public directory when the root URL is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(dirName, "public", "index.html"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

// Tell app to listen to the port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
