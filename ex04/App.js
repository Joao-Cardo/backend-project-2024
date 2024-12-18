import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectToDatabase from "./config/db.js";
import movieRoutes from "./routes/movies.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

export const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(express.json()); // JSON coding by default

// General route
app.get("/", (req, res) => {
  res.send("Welcome to the Movie Manager.");
});

// Routes for the whole app
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

// start the server
const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Movie management SERVER start in port ${PORT}`);
  });
};

startServer();

//Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send("The requested route doesn't exist.");
});
