CSCI E-64 Visualization
Project II
Brad Taylor & Ted Natoli
Code README file

1. How do we run your code? 

All of the code used to build the visualizations are contained within the folder 'website.'
The code can be run by opening website/index.html in a web browser. Our JavaScript scripts use some of D3's more
advanced data access features, such as d3.json and d3.csv, to access our data, so these do require the use
of Python's SimpleHTTPServer or some other web server. Without this, our code will not properly load the data
and the visualizations will fail to render.



2. Which parts of your code are responsible for what?

Our code consists of 3 main parts:
a. index.html - This file is the HTML 'skeleton' of our visualizations. It provides the backbone on which the
		       JavaScript scripts, using D3, build our visualizations.
b. JavaScript scripts:
	i. brad.js - A script written mostly by Brad Taylor that generates the map-based visualizations.
	ii. ted.js - A script written mostly by Ted Natoli the generates the line graph and bar charts.
	iii. pageLoad.js - A script that handles the sequence of function calls in brad.js and ted.js
				    and ensures that DOM objects are built in the appropriate order.
c. website.css - A CSS file used to style the visualizations.



3. Which parts are libraries and are they hosted in the folder or externally online?

We use two libraries (D3 and datamaps) to generate our visualizations, and the source files for both
are contained within website/libraries.



4. What data files are you using and how are they being fed into the code?

The data files we are using are:
a. tweets.csv - A file containing the raw scraped tweet data. This is used by brad.js and is loaded using
D3's d3.csv function.
b. norm_tweets_per_day.csv - A file containing the average number of vulgar and control tweets and 
							their ratio for each of the days we collected data. This is loaded using
							D3's d3.csv function.
c. raw_tweet_dstrib_by_day.json - A file containing the raw number of occurrences for each of our search terms
							for each of the days we collected data. It is loaded using D3's d3.json function.

5. Any other information we need to understand your code. 

The visualizations are described but parts 1 through 4, but we also included our data collection and analysis 
scripts in the 'analysis_scripts' folder. These are not needed for generating the visualizations, but helped
gather and process the data and generate the files that feed into the visualizations. 

