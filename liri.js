//LIRI BOT

//Requirements and dependencies
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

//Take in arguments and create keywords
var action = process.argv[2];
var keyword = process.argv.slice(3).join(" ");

var concertThis = function (artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            concertData = JSON.parse(body);
            for (i=0; i<concertData.length; i++) {
                console.log("");
                console.log("###############################################");
                console.log("");
                console.log("Concert "+(i+1));
                console.log("Venue Name: "+concertData[i].venue.name);
                if (concertData[i].venue.country == "United States") {
                    console.log("Location: "+concertData[i].venue.city+", "+concertData[i].venue.region+", "+concertData[i].venue.country);
                }
                else {
                    console.log("Location: "+concertData[i].venue.city+", "+concertData[i].venue.country);
                }
                    console.log("Date: "+moment(concertData[i].datetime).format('MMMM Do YYYY'));
            }
        }
    });
}

var spotifyThis = function (song) {
    if (!song) {
        song = "the sign"
    }
    console.log(song);
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (i=0; i<data.tracks.items.length; i++) {
            if (data.tracks.items[i].name.toLowerCase()==song.toLowerCase()) {
                console.log("");
                console.log("###############################################");
                console.log("");
                console.log("Artist Name: "+data.tracks.items[i].artists[0].name);
                console.log("Song Name: "+data.tracks.items[i].name);
                console.log("Preview Link: "+data.tracks.items[i].preview_url);
                console.log("Album Name: "+data.tracks.items[i].album.name);
                console.log("");
                console.log("###############################################");
                console.log("");
            }
        }
    });
}

var movieThis = function (movie) {
    if (!movie) {
        movie = "mr nobody"
    }
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("");
            console.log("###############################################");
            console.log("");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            for (i=0; i<JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source == "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[i].Value)
                }
            }
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("");
            console.log("###############################################");
            console.log("");
        }
    });
}

var doWhatItSays = function () {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        action = dataArr[0];
        keyword = dataArr[1];
        keyword = keyword.replace(/['"]+/g, '');
        switch (action) {
            case "concert-this":
                concertThis(keyword);
                break;
        
            case "spotify-this":
                spotifyThis(keyword);
                break;
        
            case "movie-this":
                movieThis(keyword);
                break;
        }
    });
};

switch (action) {
    case "concert-this":
        concertThis(keyword);
        break;

    case "spotify-this":
        spotifyThis(keyword);
        break;

    case "movie-this":
        movieThis(keyword);
        break;

    case "do-what-it-says":
        doWhatItSays(keyword);
        break;
}