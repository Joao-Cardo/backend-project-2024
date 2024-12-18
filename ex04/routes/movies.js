import express from "express";
import {
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  addMovie,
} from "../controllers/movieController.js";
import validateMovie from "../middleware/validateMovie.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Define top level routes and pass them to controller function (route handler)
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", authenticate, validateMovie, addMovie);
router.put("/:id", authenticate, validateMovie, updateMovie);
router.delete("/:id", authenticate, deleteMovie);

export default router;
