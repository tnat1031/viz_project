window.onload = function() {
	drawMap();
	//drawCharts();
	d = drawOne("data/norm_tweets_per_day.csv", "avg_vulgar_tweets");
	z = drawScatter("data/social_data_combined.csv", "median_income_dollars");
	//console.log(d);
	//console.log(z);
}