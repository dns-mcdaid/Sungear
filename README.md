# Sungear

Sungear enables rapid, visually interactive exploration of large sets of genomic data. It allows browsing of gene sets by experiment membership, gene annotation, and ontological term. The purpose of Sungear is to make otherwise complicated queries quick and visually intuitive.

## Authors

* [Radhika Mattoo](https://github.com/radhikamattoo)
* [Dennis McDaid](https://github.com/RajahBimmy)

## Guide and FAQ
If you have questions about how to use Sungear, or if it isn't loading properly, check out the sungear [wiki](https://github.com/RajahBimmy/Sungear/wiki).

## Dependencies

Sungear relies on the following tools to get rolling at home:

* [Node.js](https://nodejs.org/en/): Runtime environment for entire program.
* [Browserify](http://browserify.org/): A magical gift from the Gods which brings all of the fun Node has to offer to the client side.
* [Express](https://expressjs.com/): The jelly to Node's peanut butter. Holds together and keeps track of our dependencies.
* [p5](http://p5js.org/): Data visualizer for Sungear GUI and GeneLights description.
* [Collections.js](http://www.collectionsjs.com/): SortedSet resource.
* [Clipboard.js](https://clipboardjs.com/): Used for copying data to the clipboard.
* [Jade](http://jade-lang.com/): Template for Node apps.
* [jQuery](https://jquery.com/): Necessary for Bootstrap and manipulating Javascript Objects.
* [Bootstrap](http://getbootstrap.com/): Grid System responsible for our entire UI looking somewhat easy on the eyes.
* [MongoDB](https://www.mongodb.com/) Because the data's gotta go somewhere.

A live link will be available within the next month or so. In the meantime, you can check out VirtualPlant's implementation [here](http://virtualplant.bio.nyu.edu/cgi-bin/vpweb/).

## Running Locally

To run SunGear locally, you'll need [Node.js](https://nodejs.org/en/) installed, then install [Browserify](http://browserify.org/) via the following command:

`npm install -g browserify`

With Node and Browserify, navigate to the SunGear project folder and run:

`npm install`

This may take a minute or two to set up all SunGear dependencies, but once complete you'll only have one more step to go.

`browserify public/javascripts/main.js -o public/javascripts/out.js -d`

This will compress all client-side SunGear files into a file called `out.js`, which handles the work from here. At this point, run

`npm start`

Navigate to `localhost:3000` to test SunGear with fake data (at this time, the data is taken from George R.R. Martin's [Game of Thrones](https://en.wikipedia.org/wiki/Game_of_Thrones).

## Background

SunGear started as a research project in late 2015 when [Professor Dennis Shasha](http://www.cs.nyu.edu/shasha/) approached Radhika Mattoo and Dennis McDaid with the opportunity to re-invent a gene analysis application being used by the NYU Biology department. The original Java applet was written around 2004 by [Chris Poultney](https://scholar.google.com/citations?user=llt18PUAAAAJ&hl=en), and had grown outdated in the midst of the recent web app revolution. The task started out as a simple translation of legacy code from Java to JavaScript, but over the course of nearly a full year evolved into a crash course on full stack web development, total immersion in modern JavaScript development, and an unfathomable amount of red bulls consumed. As of September 2016, SunGear is nearly finished (minus a feature or two), and will be deployed within the month.
