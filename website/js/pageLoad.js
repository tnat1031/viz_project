bnames_json = [ { name: "avg_vulgar_tweets", display: "Average vulgar tweets"},
				{ name: "avg_control_tweets", display: "Average innocuous tweets"},
				{ name: "norm_tweets", display: "Ratio"} ];

window.onload = function() {
	drawMap();
	
	// draw the line graph
	drawOne("data/norm_tweets_per_day.csv", "avg_vulgar_tweets");
	var e = d3.select("#time_tab").selectAll(".viz_sidebar");
	console.log(e);
	addButtons(e, "data/norm_tweets_per_day.csv", bnames_json);

	// draw the bar chart
	drawBarChart("2013-04-02", "red");
	

	z = drawScatter("data/social_data_combined.csv", "median_income_dollars");
	//console.log(z);
}