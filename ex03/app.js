import express, { json } from "express";
import morgan from "morgan";
import { MongoClient, ServerApiVersion } from "mongodb";
const app = express();
const PORT = 3000;
const uri =
  "mongodb+srv://jfcardo2000:wMe85XHMQKdhqfgQ@backendcluster.kcc9q.mongodb.net/?retryWrites=true&w=majority&appName=BackendCluster";

const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
  { id: 4, title: "Oppenheimer", director: "Christopher Nolan", year: 2023 },
];

app.use(morgan("dev"));
// JSON coding by default
app.use(json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// The basic entry point (initial route)
app.get("/", (req, res) => {
  let html = "Movie Management App <ul>";
  // Show all movies on the HTML page
  movies.forEach((movie) => {
    html += `<li>Title:${movie.title}, Director: ${movie.director}, Year: ${movie.year} </li>`;
  });
  html += "</ul>";
  res.send(html); //send the HTML
});

// GET /movies? to return all movies that fit optional filters
app.get("/movies", (req, res) => {
  let filteredMovies = [...movies];
  const { title, director, year } = req.query;

  // Filter by title, if given
  if (title) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  // Filter by director, if given
  if (director) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.director.toLowerCase().includes(director.toLowerCase()),
    );
  }

  // Year filter, if given
  if (year) {
    const yearInt = parseInt(year);
    if (!isNaN(yearInt)) {
      //valid year
      filteredMovies = filteredMovies.filter((movie) => movie.year === yearInt);
    } else res.status(404).send(" Invalid filter for year. ");
  }

  res.status(200).json(filteredMovies);
});

// GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get movie with certain ID
app.get("/movies/:id", (req, res) => {
  // find a movie with given id. Return if found, return error code if not found
  // by default, all parameters are "text"
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (movie) {
    //Movie is not undefined, it's found
    res.json(movie); // HTTP status defaults to OK(200)
  } else {
    // send error code
    res.status(404).send(" No movies with given ID found. ");
  }
});

// POST movie: add a new movie
app.post("/movies", (req, res) => {
  // We can do this with object destruction syntax of ES6
  // req.body is a JSON object (the data object sent by the client app)
  const { id, title, director, year } = req.body;

  // Data validation, check for mandatory fields, at least title, year, director
  if (!title || !director || !year) {
    // Incomplete movie => error code 400: Bad Request
    return res
      .status(400)
      .send(" Invalid movie object in POST: All fields are mandatory. ");
  }

  /*if (!id) {
    id = movies.length + 1;
  }*/

  const intYear = parseInt(year);

  // Year validation
  if (intYear < 1888 || isNaN(intYear)) {
    return res
      .status(400)
      .send(" Invalid data in POST: Movies before 1888 can't be added. ");
  }

  // Create a new movie with data provided
  const newMovie = { id, title, year, director };
  movies.push(newMovie);

  // return the status to the client
  /// 201 = Created, the created object is typically returned to the client as body
  res.status(201).json(newMovie);
});

// DELETE /movies/:id: Delete a movie by ID
app.delete("/movies/:id", (req, res) => {
  const index = movies.findIndex(
    (movie) => movie.id === parseInt(req.params.id),
  );
  if (index !== -1) {
    movies.splice(index, 1); // splice method to remove (update the existing array)
    //Movie successfully deleted -> 204 No Content
    res.status(204).send(" Movie deleted ");
  } else {
    // No movie found -> 404 (Not Found )
    res.status(404).send(" No movie found. ");
  }
});

// PUT (update movie data)
app.put("/movies/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (movie) {
    //movie found so update the data (if valid)
    const { title, year, director } = req.body;

    const intYear = parseInt(year);

    // Year validation
    if (intYear < 1888 || isNaN(intYear)) {
      return res
        .status(400)
        .send(" Invalid data in POST: Movies before 1888 can't be added. ");
    }
    // If the data field isn't in the PUT request (i.e. undefined), keep the original values
    movie.title = title || movie.title;
    movie.year = year || movie.year;
    movie.director = director || movie.director;

    res.json(movie); // .status(200) is done by default
  } else {
    res.status(404).send("No movie with that id to update");
  }
});

//Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send("The requested route doesn't exist.");
});

// Start the server in port 3005
app.listen(PORT, () => {
  console.log(`Movie management SERVER start in port ${PORT}`);
});

// What about nodemon? Without Nodemon, I'd need to close and re-open the server after every change in my code
// How to test the app:
// 1. We can do it by browser to localhost port 3005
// 2. We can use REST Client VSCode Extension to do that (for simpler use cases)
// 3. We can use Postman to do that (more complete tool)
