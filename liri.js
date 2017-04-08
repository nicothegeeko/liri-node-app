// Requires for various NPM packages and keys for Twitter
var keys = require('./keys.js');
var fs = require('fs');
var Twitter = require('twitter')
var spotify = require('spotify');
var omdb = require('omdb');
var request = require('request');

var client = new Twitter(keys.twitterKeys);

//Seperates the NPM arguments put into the console by the user 
var removeSpaces = process.argv.slice(3)
var nameOfItem = removeSpaces.join(" ");





// Grabs command line arguments placed in terminal by user 
if (process.argv[2] == "my-tweets") {
    loadTweets();

} else if (process.argv[2] === "spotify-this-song") {
    if (process.argv[3] !== undefined) {
        spotifySong(nameOfItem);
    } else {
        spotifySong("Young Folks");
    }
} else if (process.argv[2] === "movie-this") {
    if (process.argv[3] !== undefined) {
        loadMovie(nameOfItem);
    } else {
        loadMovie("Mr. Nobody");
    }
} else if (process.argv[2] == "do-what-it-says") {
    loadRando()
} else {
    console.log("Please Choose an Argument " + " *my-tweets* " + " *spotify-this-song* " + " *movie-this* " + " *do-what-it-says* " + " and enter in the command line ");
}

//npm package used to get 20 tweets from twitter account connected to keys
function loadTweets() {

    console.log("Recent Tweets")

    //parameters for requesting tweets and amount of tweets
    var params = {
        screen_name: 'FancyPantsNico',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        // If the request is successful
        if (!error) {
            for (var i = 0; i < 20; i++)
                console.log("-------" + "Tweet From @FancyPantsNico" + "---------" + "  " + "[" + "Tweeted On:" + tweets[i].created_at + tweets[i].text + "]");



        }
    });
};

//npm package used to get information on songs by title in Spotify 
function spotifySong(name) {

    console.log("Song Info")


    spotify.search({ type: 'track', query: name }, function(err, data) {
        // If the request is successful 
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);


    });

};

//npm package used to get information on songs Movies by title using OMDB API
function loadMovie(movie) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parsing body of OMDB API info 
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Languages: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        }
    });



};

var inputOne = process.argv[2];
var inputTwo = process.argv[3];

//getting information from random.txt file and using it to run randomly selected data request type
function loadRando() {
    console.log("Loading Random.txt file");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {

            //split data, declaring variables
            var dataArr = data.split(',');
            inputOne = dataArr[0];
            inputTwo = dataArr[1];


            //attempting to change code to be executed when rendering random.txt 
            switch (dataArr) {
                case 'my-tweets':
                    loadTwitter(arg);
                    break;
                case 'spotify-this-song':
                    spotifySong(arg);
                    break;
                case 'movie-this':
                    loadMovie(arg);
                    break;
            }




        }


    })
};
