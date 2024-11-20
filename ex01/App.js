// Let's create a basic Node Express Web Server
// We need to use Express module, which is not a part of the node core (like FS, HTTP, URL, OS etc.)
import express, { json } from "express";

const app = express(); // Create an express app
const PORT = 3000; // Define a port for testing
const URL = `http://localhost:${PORT}/`; // URL constant for simplicity

//Midware to parse JSON in the request body
app.use(json());

// Movie collection
const movies = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
    { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

// Define routes and methods for server
// To implement an Express server is to implement functionality for different routes or parameters

// Define arrow function when the client comes without a route
// Let's return HTML page with all movie info by default
app.get('/', (req, res) => {
    // Let's build the HTML with all movies dynamically here
    let html = '<h1>Movies</h1>';
    html += '<ul>';
    //Let's add a simple HTML list with existing movies in the json array
    movies.forEach(movie => {
        //Add each movie to HTML
        html += `<li>Name: ${movie.title}, ${movie.director}, ${movie.year}</li>`;
    });
    html += '</ul>';
    res.send(html);
});

// Sending a JSON doesn't require headers, there's less boilerplate
app.get('/movies', (req, res) => {
    res.json(movies);
});

// '/movies/id' needs to be a ROOT parameter
// In Express, we need to add a colon ':', makes it a parameter instead of a plain, hardcoded path
app.get('/movies/:id', (req, res) => {
    // Let's find a movie by id from the json array movies and if found, return it as json to the client
    const movie = movies.find(movie => movie.id == parseInt(req.params.id));
    // Return the movie data as an individual JSON object
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('<b>No movie found</b>');
    }
});

// Add POST method to add a movie from client side (adding can be done with web app, 
// browser dev tools, postman or RestClient extension of VSCode)
app.post('/movies', (req, res) => {
    // Add a new movie to the JSON array, harcoded without using paramters
    // const newMovie = {id: movies.length + 1, title: "Interstellar", director: "Christopher Nolan", year: 2014};

    // Use object destruct syntax (the object comes for client with the post so the object should 
    // have id, title, director and year)
    // With modern JS we can construct the movie like this
    const {id, title, director, year} = req.body; //req.body should contain all these fields in its object
    if(!id || !year || !title || !director) {
        // Something is missing from the request body JSON so we don't add incomplete movies and return an error
        return res.status(400).send('<b>Invalid movie object in POST</b>');
    }
    const newMovie = {id, title, director, year};
    movies.push(newMovie); // Adds a new movie to the array
    res.status(201).json(newMovie);
});


// Let's start the server listening to the requests on port 3004
app.listen(PORT, () => {
    console.log(`Server running at ${URL} waiting for requests`);
});

// There is a Hot reload tool available, called Nodemon
// With nodemon we don't need to Ctrl+C and re-open the server. It updates and reruns automatically upon save (=> great tool)
// Running with nodemon -> nodemon App.js