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
router.get("/", authenticate(["admin", "regular"]), getAllMovies);
router.get("/:id", authenticate(["admin", "regular"]), getMovieById);
router.post("/", authenticate(["admin"]), validateMovie, addMovie);
router.put("/:id", authenticate(["admin"]), validateMovie, updateMovie);
router.delete("/:id", authenticate(["admin"]), deleteMovie);

export default router;
