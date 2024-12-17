require("dotenv").config(); // loading required environmental libraries
import express, { json, query } from "express";
import morgan from "morgan";
import mongoose, { mongo } from "mongoose";
const app = express();
const PORT = 3000;

console.log("Environment variable MONGODB_URI: ", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Define schema and model for Movies (students must have title, director and year)
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Int32, required: true }, // how to constrain the year to after 1888?
});

// Model for movie
const Movie = mongoose.model("Movie", movieSchema, "movies");

app.use(morgan("dev"));
app.use(json()); // JSON coding by default

// The basic entry point (initial route)
app.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    let html = "Movie Management App <ul>";
    // Show all movies on the HTML page
    movies.forEach((movie) => {
      html += `<li>Title:${movie.title}, Director: ${movie.director}, Year: ${movie.year} </li>`;
    });
    html += "</ul>";
    res.send(html); //send the HTML
  } catch (error) {
    res.status(500).send("Error retrieving movies.");
  }
});

// GET /movies? to return all movies that fit optional filters
app.get("/movies", async (req, res) => {
  try {
    const query = [];
    if (req.query.title) query.title = req.query.title;
    if (req.query.director) query.director = req.query.director;
    if (req.query.year) query.year = parseInt(req.query.year);
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (error) {
    res.status(500).send("Error retrieving movies.");
  }
});

// GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get movie with certain ID
// Async operations due to fetching from remote database

app.get("/movies/:id", async (req, res) => {
  try {
    // find a movie with given id. Return if found, return error code if not found
    // by default, all parameters are "text"
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      //Movie is not undefined, it's found
      res.json(movie); // HTTP status defaults to OK(200)
    } else {
      // send error code
      res.status(404).send(" No movies with given ID found. ");
    }
  } catch (error) {
    res.status(500).send("Error retrieving movies.");
  }
});

// POST movie: add a new movie
app.post("/movies", async (req, res) => {
  try {
    const { title, director, year } = req.body;
    const newMovie = new Movie({ title, director, year });
    await newMovie.save();
    res.status(204).json(newMovie);
  } catch (error) {
    res
      .status(400)
      .send("Invalid movie object in POST: All fields are mandatory.");
  }
});

// DELETE /movies/:id: Delete a movie by ID
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (movie) res.status(204).send("Movie deleted.");
    else res.status(404).send("No movie found.");
  } catch (error) {
    res.status(500).send("Error retrieving movies.");
  }
});

// PUT (update movie data)
app.put("/movies/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, updatedData);
    // if found, return it
    if (movie) {
      res.status(201).json(movie);
      // throw error for invalid data
    } else res.status(400).send("No movie found in the database.");
  } catch (error) {
    res.status(400).send("Invalid movie data.");
  }
});

//Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send("The requested route doesn't exist.");
});

// Start the server in given PORT
app.listen(PORT, () => {
  console.log(`Movie management SERVER start in port ${PORT}`);
});
