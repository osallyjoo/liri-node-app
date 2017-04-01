// what we need to require
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var input = process.argv.splice(2);
callRouter(input);

function callRouter(input) {
    switch(input[0]) {
        case 'my-tweets':
            twitterCall();
            break;
        case 'spotify-this-song':
            spotifyCall(input[1]);
            break;
        case 'movie-this':
            omdbCall(input[1]);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("That is not a valid command.")
    }
}

// 1. twitter command show your last 20 tweets & when they were created in your terminal bash 
function twitterCall() {
    var client = new Twitter(keys.twitterKeys);
    var params = {screen_name: 'osallyjoo', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
        }
    });
}

// 2. spotify command will song info in your terminal bash 
function spotifyCall(input){
    // If no song is provided, then your program will default to: "The Sign" by Ace of Base    
	songName = (input)?input:"The Sign"; 
	spotify.search({ type: 'track', query: songName }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
        songInfo = data.tracks.items[0];
	    console.log("Artist: " + songInfo.album.artists[0].name);
	    console.log("Song: " + songInfo.name); 
	    console.log("Preview-url: " + songInfo.preview_url); 
	    console.log("Album: " +songInfo.album.name); 
	});
}

// 3. movie-this command will output movie info in your terminal bash
function omdbCall(input){
    // if user doesn't type in a movie, program will output data for Mr. Nobody
	movieTitle = (input)?input:"Mr. Nobody"; 
	request('http://www.omdbapi.com/?t='+movieTitle+'&y=&plot=short&r=json&tomatoes=true', function(error, response, body){
		if(!error && response.statusCode === 200){
            // Movie Title
			console.log(JSON.parse(body).Title);
            // Year movie came out
			console.log(JSON.parse(body).Year);
            // imdb rating 
		 	console.log(JSON.parse(body).imdbRating);
             // Country where movie was produced
		 	console.log(JSON.parse(body).Country);
             // Language of movie
		 	console.log(JSON.parse(body).Language);
             // Plot of movie
		 	console.log(JSON.parse(body).Plot);
             // Actors in movie
		 	console.log(JSON.parse(body).Actors);
             // Rotten Tomatoes Rating
		 	console.log(JSON.parse(body).tomatoConsensus);
             //Rotten Tomatoes URL
		 	console.log(JSON.parse(body).tomatoURL); 
		}
	});
}

// 4. do-what-it-says command will take text inside of random.txt and use fs package to call one of liri's commands 
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        var input = data.split(',');
        callRouter(input);
    })
}