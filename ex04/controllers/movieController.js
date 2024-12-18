// Route handler Controller
import Movie from "../models/movie.js";

// GET /movies with optional parameters
export const getAllMovies = async (req, res) => {
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
};

// Get movie with certain ID
// Async operations due to fetching from remote database
export const getMovieById = async (req, res) => {
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
};

// POST movie: add a new movie
export const addMovie = async (req, res) => {
  try {
    const { title, director, year } = req.body;
    const newMovie = new Movie({ title, director, year });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the movie." });
  }
};

// DELETE /movies/:id: Delete a movie by ID
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (movie) res.status(204).send("Movie deleted.");
    else res.status(404).send("No movie found.");
  } catch (error) {
    res.status(500).send("Error retrieving movies.");
  }
};

// PUT (update movie data)
export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    // if found, return it
    if (updatedMovie) {
      res.status(201).json(updatedMovie);
    } else res.status(404).send("Movie not found in the database.");
  } catch (error) {
    res.status(400).send("Invalid movie data.");
  }
};
