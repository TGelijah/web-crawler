import fetch from "node-fetch";
import cheerio from "cheerio";

/*
TODO 1: Update code to allocate workers accordingly
TODO 2: Add functionality to both the shell script and worker script to allow users pick elements the want to crawl for on the fly
TODO 3: Update Crawler function to only crawl links with the same domain
TODO 4: Update code to correctly check the flags being passed
*/

//stores link
let webLink = "http://";

//stores argument that sets workers
let workers;

//tracks links that has been visited
let seen = {};

//goes through argument to find arguments that match a link and contains a number and assigns them respectively
if (process.argv.length) {
	process.argv.map((arg, i) => {
		if (arg.includes("www")) {
			webLink = webLink + arg.slice(1, arg.length - 1);
		}
		if (!isNaN(arg.slice(1, arg.length - 1))) {
			workers = arg.slice(1, arg.length - 1);
		}
	});
}

// web crawler function
const crawler = async (url) => {
	const base = url;
	try {
		console.log("Crawling:", url);
		if (seen.url) {
			return;
		}
		if (url.includes(String(base))) {
			let res = await fetch(url);
			seen[url] = true;
			const html = await res.text();
			const $ = cheerio.load(html);
			const links = $("a")
				.map((i, link) => link.attribs.href)
				.get();

			links.map((link, i) => {
				crawler(link);
			});
		}
	} catch {
		console.log("Invalid Url");
	}
};

//track crawler count
let count = 1;

// a loop to create multiple crawlers bassed on input
while (workers >= 1) {
	crawler(webLink);
	count;
	workers -= 1;
}
