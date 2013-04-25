bnames_json = [ { name: "avg_vulgar_tweets", display: "Average vulgar tweets"},
				{ name: "avg_control_tweets", display: "Average innocuous tweets"},
				{ name: "norm_tweets", display: "Ratio"} ];
				
snames_json = [ { name: "population_per_square_mile", display: "Population Density"},
				{ name: "median_income_dollars", display: "Median Income"},
				{ name: "percent_bachelors_or_higher", display: "Percent College Educated"}, 
				{ name: "crime_per_capita", display: "Crime"}];

window.onload = function() {
	drawMap();
	
	// draw the line graph
	drawOne("data/norm_tweets_per_day.csv", "avg_vulgar_tweets");
	var e = d3.select("#time_tab").selectAll(".viz_sidebar");
	console.log(e);
	addButtons(e, "data/norm_tweets_per_day.csv", bnames_json);

	// draw the bar chart
	drawBarChart("2013-04-02", "red");
	
	// draw the scatter chart
	drawScatter("data/social_final.csv", "median_income_dollars");
	var s = d3.select("#social_tab").selectAll(".viz_sidebar");
	//console.log(s);
	addSocialButtons(s, "data/social_final.csv", snames_json);

}