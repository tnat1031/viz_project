bnames_json = [ { name: "avg_vulgar_tweets", display: "Average vulgar tweets"},
				{ name: "avg_control_tweets", display: "Average innocuous tweets"},
				{ name: "norm_tweets", display: "Ratio"} ];
				
snames_json = [ { name: "crime_per_capita", display: "Crime"},
				{ name: "population_per_square_mile", display: "Population Density"},
				{ name: "median_income_dollars", display: "Median Income"},
				{ name: "percent_bachelors_or_higher", display: "Percent College Educated"} ]

tnames_json = [ { name: "all_terms", display: "Crime"},
				{ name: "fuck", display: "Crime"},
				{ name: "shit", display: "Crime"},
				{ name: "bitch", display: "Crime"},
				{ name: "ass", display: "Crime"},
				{ name: "asshole", display: "Crime"},
				{ name: "dick", display: "Crime"},
				{ name: "cunt", display: "Crime"},
				{ name: "nigger", display: "Crime"},
				{ name: "nigga", display: "Crime"},
				{ name: "faggot", display: "Crime"},
				{ name: "spic", display: "Crime"},
				{ name: "slut", display: "Crime"},
				{ name: "whore", display: "Crime"},
				{ name: "fucker", display: "Crime"},
				{ name: "mother fucker", display: "Crime"},
				{ name: "kill", display: "Crime"},
				{ name: "beat", display: "Crime"},
				{ name: "rape", display: "Crime"},
				{ name: "fight", display: "Crime"},
				{ name: "stab", display: "Crime"},
				{ name: "shoot", display: "Crime"},
				{ name: "twitter", display: "Crime"},
				{ name: "tweet", display: "Crime"} ];
				
window.onload = function() {
	// draw the chloropleth map
	drawMap("data/chloropleth_data.csv", "all_terms", "all_dates");
	var m = d3.select("#geo_tab").selectAll(".viz_sidebar");
	//console.log(m);
	addMapButtons(m, "data/chloropleth_data.csv", tnames_json);
	
	// draw the line graph
	drawOne("data/norm_tweets_per_day.csv", "avg_vulgar_tweets");
	var e = d3.select("#time_tab").selectAll(".viz_sidebar");
	console.log(e);
	addButtons(e, "data/norm_tweets_per_day.csv", bnames_json);

	// draw the bar chart
	drawBarChart("2013-04-02", "red");
	
	// draw the scatter chart
	drawScatter("data/social_tweet_data.csv", "crime_per_capita");
	var s = d3.select("#social_tab").selectAll(".viz_sidebar");
	//console.log(s);
	addSocialButtons(s, "data/social_tweet_data.csv", snames_json);

}