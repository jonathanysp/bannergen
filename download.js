var request = require('request');
var cheerio = require('cheerio');
var Datastore = require('nedb');

var db = new Datastore({filename: "db", autoload: true});

var courses = {};
var ss = [];
var URL = "https://courses.brown.edu";
var sub = "subjects/7380"

function Course(title, teaser, info) {
	return {
		title: title,
		teaser: teaser,
		info: info
	}
}

function getSubjects() {
	request("https://courses.brown.edu/subjects", function(err, res, body) {
		$ = cheerio.load(body);

		var subjs = $('.views-summary');

		for (var i = 0; i < subjs.length; i++) {
			var a = $(subjs[i]).children('a');
			var subj = $(a).attr('href');
			ss.push(subj);
		}

		ss.forEach(function(ele) {
			console.log(URL + ele);
			requestPage(URL + ele);
		})
	})
}

function requestPage(url) {
	request(url, scrape);
}

function scrape(err, res, body) {
	$ = cheerio.load(body);

	var cs = $(".course-teaser-title");
	var teasers = $(".course-teaser");

	for (var i = 0 ; i < cs.length; i++) {
		var title = $($(cs[i])).text();
		var teaser = cw($($(teasers[i])).text().trim());
		var info = $($(cs[i])).next('p').text();

		if (courses[title] === undefined) {
			courses[title] = new Course(title, teaser, info);
			db.insert(courses[title]);
		}
	}

	var next = $(".pager-next");
	if (next.length === 1) {
		sub = $($(next).children('a')[0]).attr('href');
		console.log(URL + sub);
		requestPage(URL + sub);
	} else {
		// console.log(courses);
	}
}

function cw(str) {
	return str.replace('\\n', ' ');
}

// requestPage("https://courses.brown.edu/subjects/7380");
getSubjects();
