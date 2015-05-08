var Datastore = require('nedb');
var db = new Datastore({filename: "db", autoload: true});

var terminals = {};
var startwords = [];
var wordstats = {};

db.find({}, function(err, docs) {
	var teasers = docs.map(function(e) {
		return e.teaser.replace('/n', ' ');
	})
	var titles = docs.map(function(e) {
		return e.title;
	})
	var info = docs.map(function(e) {
		return e.info;
	})

	var titleGen = new Markov();
	titleGen.train(titles);
	module.exports.titleGen = titleGen;

	var teaserGen = new Markov();
	teaserGen.train(teasers);
	module.exports.teaserGen = teaserGen;

	var infoGen = new Markov();
	infoGen.train(info);
	module.exports.infoGen = infoGen;

})

function Markov() {
	var terminals = {};
	var startwords = [];
	var wordstats = {};
	var sum = 0;
	var count;

	var train = function(titles) {
		count = titles.length;
		sum = 0;
		for (var i = 0; i < titles.length; i++) {
		    var words = titles[i].split(' ');
		    sum += words.length;
		    terminals[words[words.length-1]] = true;
		    startwords.push(words[0]);
		    for (var j = 0; j < words.length - 1; j++) {
		        if (wordstats.hasOwnProperty(words[j])) {
		            wordstats[words[j]].push(words[j+1]);
		        } else {
		            wordstats[words[j]] = [words[j+1]];
		        }
		    }
		}
	}

	var choice = function (a) {
	    var i = Math.floor(a.length * Math.random());
	    return a[i];
	};

	var gen = function(){
		return make_title(sum/count);
	}

	var make_title = function (min_length) {
	    word = choice(startwords);
	    var title = [word];
	    while (wordstats.hasOwnProperty(word)) {
	        var next_words = wordstats[word];
	        word = choice(next_words);
	        title.push(word);
	        if (title.length > min_length && terminals.hasOwnProperty(word)) break;
	    }
	    if (title.length < min_length) return make_title(min_length);
	    return title.join(' ');
	};

	return {
		train: train,
		make_title: make_title,
		gen: gen
	}
}