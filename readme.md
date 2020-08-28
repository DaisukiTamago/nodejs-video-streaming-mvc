# MVC Node.js video streaming over HTTP protocol

### Overview
This project is a MVC server that uses Node.js Streams behind the scenes to dynamically stream video files that can be consumed by any video player through HTTP routes

### Features
1. Automatic file's structure generation
2. Automatic data fetching from The Movie Database API
3. Create resources in database with a simple POST method

### Setup
After clone the project:
`yarn install`: to install the dependencies
`yarn start`: get the server running

Before run `yarn start` for the first time you must fill the `.env` file with your data:
    1. `DB_NAME`: your MongoDB database name
    2. `DB_ATLAS_PASSWORD`:your MongoDB database password
    3. `DB_ATLAS_USERNAME`: your MongoDB database username
    4. `TMDBAPIKEY`: the key to acess The Movie Database API, link at the bottom of the document
    5. `ADRESS`: the adress where your server will run
    6. `PORT`: the port where your server will run
    
### Basic API
`GET /`: returns the webapp that consumes this backend
`GET /api/content`: Returns an array with all content in database
`GET /api/content/watch/:show_id/:season_number/:episode_number`: Returns a chunk with video data that will be consumed by the video player, commonly it will be used as an src attribute. If the server fails at finding a mp4 file at the path: `/media/show_id/season_number/episode_number.mp4` it will send a file located at `/media/error.mp4` as a fallback
`POST /api/content?id=show_id`: Fetch from The Movie Database info about the Tv Show that corresponds to the show_id passed in the url, creates the resource in the database and automatically generates the file struture in the `/media` directory


Get your TheMovieDB Api key: https://developers.themoviedb.org/3/getting-started/introduction
*show_id refers to an tv show id that you can get on TheMovieDB website

