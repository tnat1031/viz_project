bnames_json = [ { name: "avg_vulgar_tweets", display: "Average vulgar tweets"},
				{ name: "avg_control_tweets", display: "Average innocuous tweets"},
				{ name: "norm_tweets", display: "Ratio"} ];
				
snames_json = [ { name: "crime_per_capita", display: "Crime"},
				{ name: "population_per_square_mile", display: "Population Density"},
				{ name: "median_income_dollars", display: "Median Income"},
				{ name: "percent_bachelors_or_higher", display: "Percent College Educated"} ]

tnames_json = [ { name: "all_terms", display: "all terms"},
				{ name: "fuck", display: "fuck"},
				{ name: "shit", display: "shit"},
				{ name: "bitch", display: "bitch"},
				{ name: "ass", display: "ass"},
				{ name: "asshole", display: "asshole"},
				{ name: "dick", display: "dick"},
				{ name: "cunt", display: "cunt"},
				{ name: "nigger", display: "nigger"},
				{ name: "nigga", display: "nigga"},
				{ name: "faggot", display: "faggot"},
				{ name: "spic", display: "spic"},
				{ name: "slut", display: "slut"},
				{ name: "whore", display: "whore"},
				{ name: "fucker", display: "fucker"},
				{ name: "mother fucker", display: "mother fucker"},
				{ name: "kill", display: "kill"},
				{ name: "beat", display: "beat"},
				{ name: "rape", display: "rape"},
				{ name: "fight", display: "fight"},
				{ name: "stab", display: "stab"},
				{ name: "shoot", display: "shoot"},
				{ name: "twitter", display: "twitter"},
				{ name: "tweet", display: "tweet"} ];
				
window.onload = function() {
	// draw the chloropleth map
	drawCountiesMap("data/chloropleth_data.csv", "all_terms", "4_20_2013");
	var m = d3.select("#geo_tab").selectAll(".viz_sidebar");
	//console.log(m);
	addMapButtons(m, "data/chloropleth_data.csv", tnames_json);
	
	// draw the line graph
	drawOne("data/norm_tweets_per_day.csv", "avg_vulgar_tweets", "linegraph_svg", 250, 960, true);
	var e = d3.select("#time_tab").selectAll(".viz_sidebar");
	addLineButtons(e, "data/norm_tweets_per_day.csv", bnames_json, "linegraph_svg", 250, 960, true);

	// draw the bar chart
	drawBarChart(null, "red");
    var t = d3.select("#words_tab").selectAll(".viz_sidebar");
    drawTimeLine("data/raw_tweet_distrib_by_day.json", t, "timeline");
	
	// draw the scatter chart
	drawScatter("data/social_tweet_data.csv", "crime_per_capita");
	var s = d3.select("#social_tab").selectAll(".viz_sidebar");
	//console.log(s);
	addSocialButtons(s, "data/social_tweet_data.csv", snames_json);

}