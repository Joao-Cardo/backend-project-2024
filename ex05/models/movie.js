// Definition of movie schema and validation
import mongoose from "mongoose";

// Define schema and model for Movies (students must have title, director and year)
const movieSchema = new mongoose.Schema({
  id: { type: Number, required: false, trim: true },
  title: { type: String, required: true },
  director: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1888 },
});

movieSchema.virtual("isRecent").get(() => {
  return this.year >= 2020;
});

// Model for movie
const Movie = mongoose.model("Movie", movieSchema, "movies");
export default Movie;
