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
	i. brad2.js - A script written mostly by Brad Taylor that generates the map-based visualizations and the scatterplots
	plotting tweets per capita versus various social data.
	ii. ted2.js - A script written mostly by Ted Natoli that generates the line graph and bar charts.
	iii. pageLoad.js - A script that handles the sequence of function calls in brad2.js and ted2.js
				    and ensures that DOM objects are built in the appropriate order.
c. website.css - A CSS file used to style the visualizations.



3. Which parts are libraries and are they hosted in the folder or externally online?

We use several libraries to generate our visualizations, and the source files for both
are contained within website/libraries.

These libraries are:
a. D3 - for generating vizualization elements and manipulating the DOM
b. jQuery - for facilitating the tab-based view and tab switching
c. Bootstrap - for styling the page and facilitating the tab-based view
e. topojson - used in conjunction with queue to create the map view
f. queue - used in conjunction with topojson to create the map view


4. What data files are you using and how are they being fed into the code?

The data files we are using are:
a. chloropleth_data.csv - A file containing population-corrected vulgar tweet counts used by brad2.js
							to generate the chloropleth map. Tweets are aggregated by date and search term for
							every US county. This is loaded using D3's d3.csv function.
b. social_tweet_data.csv - A file containing a table of values for social factors for every US county, as well
							as the population-corrected number of vulgar tweets collected for each county. This
							is used by brad2.js to generate the social factor scatter plot, and is loaded using
							D3's d3.csv function.
c. norm_tweets_per_day.csv - A file containing the average number of vulgar and control tweets and 
							their ratio for each of the days we collected data. This is loaded using
							D3's d3.csv function.							
d. norm_tweets_per_hour.csv - A file containing the average number of vulgar and control tweets and 
							their ratio for each of the days we collected data. This is loaded using
							D3's d3.csv function.							
e. raw_tweet_dstrib_by_day.json - A file containing the raw number of occurrences for each of our search terms
							for each of the days we collected data. It is loaded using D3's d3.json function.
f. social_final.csv - Not loaded into the visualization. This is an intermediate file representing the result
							of cleaning and merging the raw social factors data. It is used to generate the 
							file social_tweet_data.csv							
g. tweets_rev_geo - Not loaded into the visualization. A file containing a list of all tweets collected
							and reverse-geocoded. This is the raw output of our Twitter scraping utility.
							It is used to generate the aggregated datafiles (listed above) used in the visualization.						
h. /social_factor_data/* - A subdirectory containing raw social factors data from the original sources. 
							These files were cleaned extensively and merged to produce the file social_final.csv. 
							See the 'data and technical process' section of the process book for details. 

5. Any other information we need to understand your code. 

The visualizations are described in parts 1 through 4, but we also included our data collection and analysis 
scripts in the 'analysis_scripts' folder. These are not needed for generating the visualizations, but helped
gather and process the data and generate the files that feed into the visualizations.

To keep the length manageable, we wrote our Project III process book as a separate file. We have therefore included the Project III Proposal and Project II Process Book in the process_book folder alongside the Project III Process Book. Where necessary, the Project III process book makes specific references to sections in the two earlier documents. 

6. References
See below for libraries and examples used in developing this project. In the case of examples, please see the process book for discussion of the enhancements and alterations made for this project.

The JQuery library was used to fulfill dependencies from D3 and Bootstrap:

The JQuery Foundation. (n.d.). JQuery. Retrieved April 21, 2013 from http://jquery.com/. Copyright 2013 The JQuery Foundation. License

Extensive use was made of the D3 javascript library throughout the project:

Bostock, M. (2012). D3.js- Data Driven Documents. Retrieved April 2013 as part of Project II, from http://d3js.org/. Copyright 2012 Michael Bostock. Released under BSD License

The page layout, context-switch tabs functionality and filter buttons were implemented using the Bootstrap javascript library:

Mark Otton (@mdo) and Jacob Thornton (@fat). (n.d.). Bootstrap. Retrieved April 21, 2013 from http://twitter.github.io/bootstrap/index.html. Code licensed under Apache License v2.0. Documentation licensed under CC BY 3.0.

The queue.js library was used in producing the chloropleth map:

Bostock, M. (n.d.). queue.js. Retreived April 23, 2013 from https://github.com/mbostock/queue#readme. Copyright 2012 Michael Bostock. License

The topojson.js library was also used in producing the chloropleth:

Bostock, M. (n.d.). topoJSON. Retreived April 23, 2013 from https://github.com/mbostock/topojson. Copyright 2012 Michael Bostock. License

The Pattern library for python was downloaded and the source was modified for use in our tweet scraping script:

Computational Linguistics & Psycholinguistics Research Center. (n.d.). Pattern. Retreived as part of Project II from http://www.clips.ua.ac.be/pattern.  Copyright 2010 CLiPs Research Center. Licensed under BSD. http://www.linfo.org/bsdlicense.html

Reverse geocoding of tweets was accomplished using the following API:

Google. (February 13, 2013). Google Geocoding API V3. Accessed as part of Project II from https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding. License information: https://developers.google.com/maps/licensing 

The chloropleth map view was adapted from the following example:

Bostock, M. (April 21, 2013). mbostocks block #4060606; Chloropleth. In D3 Gallery. Retrieved April 23, 2013 from http://bl.ocks.org/mbostock/4060606

The map zooming and centering functionality was based on the following example:

Bostock, M. (January 15, 2013) mbostocks block #2206340; Mousewheel zoom + click to center. In D3 Gallery. Retrieved April 23, 2013 from http://bl.ock .org/mbostock/2206340

A string-capitalization utility function used while labeling counties in the social factors scatterplot tool-tip was borrowed from the following example:

Dexter (Stack overflow user 10717). Question: Javascript - How to capitalize first letter of each word, like a 2-word city? [duplicate]. In Stack Overflow. Acessed April 27, 2013, from http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city

The social-factors scatterplot view was adapted from the following example:

Bostock, M. (October 14, 2012). mbostocks block #3887188; Scatterplot. In D3 Gallery. Retrieved April 25, 2013 from http://bl.ocks.org/mbostock/3887118

The line graph view was adapted from the following example:

Bostock, M. (April 10, 2013). mbostocks block #3883245; Line Chart. In D3 Gallery. http://bl.ocks.org/mbostock/3883245

Sorting the bars in the bar graph view was facilitated by the following example:

almo (unityAnswers user). Question: Sort Two Arrays. In unityAnswers. Accessed April 12, 2013 at http://answers.unity3d.com/questions/63520/sort-two-arrays.html

County areas and population values were derived from the following data source:

U.S. Census Bureau. (n.d.) “National Counties Gazetteer File”. In 2010 Census Gazetteer Files. Accessed April 18, 2013. File: http://www.census.gov/geo/maps-data/data/docs/gazetteer/Gaz_counties_national.zip Available at: http://www.census.gov/geo/maps-data/data/gazetteer2010.html

The median income for each county was derived from the following data source:

U.S. Census Bureau. (n.d.). Table S1901: INCOME IN THE PAST 12 MONTHS (IN 2011 INFLATION-ADJUSTED DOLLARS) . Dataset: 007-2011 American Community Survey 5-Year Estimates. Generated by Brad Taylor; using American FactFinder; <http://factfinder2.census.gov>; April 18, 2013. Available at http://factfinder2.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=ACS_11_5YR_S1901&prodType=table

Percentage of U.S. county residents with a bachelors degree or higher was derived from the following data source:

U.S. Census Bureau. (n.d.). Table DP02: SELECTED SOCIAL CHARACTERISTICS IN THE UNITED STATES, 2. Dataset: 007-2011 American Community Survey 5-Year Estimates. Generated by Brad Taylor; using American FactFinder; <http://factfinder2.census.gov>; April 18, 2013. Available at http://factfinder2.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=ACS_11_5YR_DP02&prodType=table

National crime statistics were derived from the following data source:

U.S. Federal Bureau of Investigation. (n.d.). Table 10–Offenses Known to Law Enforcement, by State by Metropolitan and Nonmetropolitan Counties, 2011. In Crime in the United States 2011. Accessed April 18, 2013 File: http://www.fbi.gov/about-us/cjis/ucr/crime-in-the-u.s/2011/crime-in-the-u.s.-2011/tables/table_10_offenses_known_to_law_enforcement_by_state_by_metropolitan_and_nonmetropolitan_counties_2011.xls Available at: http://www.fbi.gov/about-us/cjis/ucr/crime-in-the-u.s/2011/crime-in-the-u.s.-2011/offenses-known-to-law-enforcement/standard-links/county-agency
