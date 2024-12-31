import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectToDatabase from "./config/db.js";
import movieRoutes from "./routes/movies.js";
import authRoutes from "./routes/auth.js";
import http from "http";
import https from "https";
import selfsigned from "selfsigned"; // Certificate generation to enable HTTPS
import { initializeWebSocket } from "./wsHandler.js";

dotenv.config();

export const app = express();
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;


const attrs = { name: 'commonName', value: 'localhost' };
const pems = selfsigned.generate(attrs, {days: 365});
const {private: privateKey, cert: certificate} = pems;

const sslOptions = {
  key: privateKey,
  cert: certificate,
};

//HTTP server for web socket  
//const server = http.createServer(app);
const server = https.createServer(sslOptions, app);

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
  server.listen(HTTPS_PORT, () => {
    console.log(`Movie management SERVER start in port ${HTTPS_PORT}`);
  });
};

initializeWebSocket(server);
startServer();

//Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send("The requested route doesn't exist.");
});
