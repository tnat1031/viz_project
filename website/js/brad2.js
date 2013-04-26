// from example here:
// http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function drawMap(file_path, colname, date) {
	d3.csv(file_path, function(rows) {
		var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		var datacol = datacols[0];
		var data = {name: datacol, values: []};
		rows.forEach(
			function(r) {
			if (r.date == date) {
				var g = +r.geoid;
				var c = +r[datacol];
				var n = r.county;
				var s = r.state_abbrev;
				data.values.push({geoid: g,
							  count: c,
							  county: n,
							  state: s});
			}
		});
		var e = d3.select("#geo_tab").selectAll("#mapDiv");
		console.log(e);
		drawCountiesMap(e, data, colname, date);
	});
	//drawCountiesMap();
}

function drawScatter(file_path, colname) {
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	d3.csv(file_path, function(rows) {
		var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		var datacol = datacols[0];
		var data = {name: datacol, values: []};
		rows.forEach(function(r) {
			var d = +r.all_tweets;
			var c = +r[datacol];
			var n = r.county;
			var s = r.state_abbrev;
			data.values.push({tweets: d,
							  factor2: c,
							  county: n,
							  state: s});
		});
		var e = d3.select("#social_tab").selectAll(".viz_body");
		console.log(e);
		drawScatterPlot(e, data, colname, "red");
	});
}

function addSocialButtons(element, file_path, snames_json) {
  element.data(snames_json).enter()
    .append("button")
    .text(function(d) { return d.display; })
    .attr("class", "btn btn-danger btn-large btn-block")
    .on("click", function(d) { drawScatter(file_path, d.name); });
}

function addMapButtons(element, file_path, tnames_json) {
  element.data(tnames_json).enter()
    .append("button")
    .text(function(d) { return d.display; })
    .attr("class", "btn btn-danger btn-large btn-block")
    .on("click", function(d) { drawMap(file_path, d.name); });
}

function drawCountiesMap(element, data11, term, date) {
	var width = 960,
    height = 500;
	
	var rateById = d3.map();
	
	var quantize = d3.scale.quantize()
		.domain([0, 0.00003])
		.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
		//.domain([0, d3.max(data.values, function(d) { return d.tweets; })])
		//.domain([0, 100000])
		//.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
		
		//alert(d3.max(data11.values, function(d) { return d.all_tweets; }));
		
	var svg = d3.select("#mapDiv").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	queue()
		.defer(d3.json, "data/us.json")
		.defer(d3.csv, "data/chloropleth_data.csv", function(r) { 
					if (r.date == '4_20_2013') {
						rateById.set(r.geoid, +r.all_terms);
					}
		})
		.await(ready);
		
		// d3.csv(file_path, function(rows) {
		// var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		// var datacol = datacols[0];
		// var data = {name: datacol, values: []};
		// rows.forEach(function(r) {
			// var d = +r.all_tweets;
			// var c = +r[datacol];
		
		
		// .defer(d3.csv, "data/chloropleth_data.csv", function(rows) { 
			// var datacols = d3.keys(rows[0]).filter(function(key) { return key == term; });
			// var datacol = datacols[0];
			// alert(datacol)
			// rows.forEach(
				// function(r) {
					// if (r.date == '4_20_2013') {
						// rateById.set(r.geoid, +r.all_terms);
					// }
			// });
		// })
		// .await(ready);
	
	//alert(rateById.get('1003'));
	
	function ready(error, us) {
		var projection = d3.geo.albersUsa()
			.scale(width)
			.translate([width / 2, height / 2]);
		
		var path = d3.geo.path()
			.projection(projection);
		
		var zoom = d3.behavior.zoom()
		  .translate(projection.translate())
		  .scale(projection.scale())
		  .scaleExtent([height, 8 * height])
		  .on("zoom", zoom);
		
		var counties = svg.append("g")
		  .attr("class", "counties")
		  .call(zoom);
		
		counties.selectAll("path")
		  .data(topojson.feature(us, us.objects.counties).features)
		  .enter().append("path")
		  .attr("class", function(d) { return quantize(rateById.get(d.id)); })
		  .attr("d", path)
		  .on("click",click);

		//states.append("rect")
	   // .attr("class", "background")
	 //   .attr("width", width)
	//    .attr("height", height);
		  
	    var states = svg.append("path")
		  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
		  .attr("class", "states")
		  .attr("d", path)
		  //.on("click",click);
		  //alert(states);

		function click(d) {
		  var centroid = path.centroid(d),
			  translate = projection.translate();

		  projection.translate([
			translate[0] - centroid[0] + width / 2,
			translate[1] - centroid[1] + height / 2
		  ]);

		  zoom.translate(projection.translate());

		  counties.selectAll("path").transition()
			  .duration(500)
			  .attr("d", path);
			  
		  states.transition()
			  .duration(500)
			  .attr("d", path);
		}

		function zoom() {
		  projection.translate(d3.event.translate).scale(d3.event.scale);
		  counties.selectAll("path").attr("d", path);
		  states.attr("d", path);
		}
	}
}

function drawScatterPlot (element, data, name, color)  {
    d3.select("#social_svg").remove();

	var tooltip = element
		.append("div")
		.attr("class", "tooltip_div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden"); 
	var toolHead = tooltip.append("h3")
		.attr("class", "tooltip_head")
	var toolTweets = tooltip.append("p")
		.attr("class", "tooltip_tweets")
	var toolFact = tooltip.append("p")
		.attr("class", "tooltip_factor")

	
	var margin = {top: 20, right: 100, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
    	.range([0, width]);

	var y = d3.scale.linear()
    	.range([height, 0]);
	
	// DO I WANT TO SCALE TO MINIMUM OF DATASET OR TO ZERO???
    x.domain(d3.extent(data.values, function(d) { return d.factor2; })).nice();
    y.domain([0, d3.max(data.values, function(d) { return d.tweets; })]).nice();

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.factor2); })
        .y(function(d) { return y(d.tweets); });
    
    var svg = element.append("svg")
		.attr("id", "social_svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
	.append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(name);;

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    	.append("text")
        	.attr("transform", "rotate(-90)")
        	.attr("y", 6)
        	.attr("dy", ".71em")
        	.style("text-anchor", "end")
        	.text("Vulgar tweets per person");

    // svg.append("path")
       // .datum(data.values)
       // .attr("class", "line")
       // .attr("d", line)
       // .style("stroke",  color);

    svg.selectAll("null_selection").data(data.values).enter().append("circle")
      	.attr("class", "tooltip_circle")
      	.attr("id", function(v) { return v.tweets; })
      	.attr("cx", function(v) { return x(v.factor2); })
      	.attr("cy", function(v) { return y(v.tweets); })
      	.attr("r", 5)
      	.attr("fill", function(v) { if(v.factor2 < 0){return 'grey'} return color})
      	.on("mouseover", function(v) {
			toolHead.text(toTitleCase(v.county)+" "+v.state);
			toolTweets.text(Math.round(v.tweets*1000000)/1000000 + " tweets per person");
			toolFact.text(Math.round(v.factor2*1000)/1000 + " " + name);
			return tooltip.style("visibility", "visible")
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
		.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});
			      
		/*.append("text")
     	.attr("class", "tweet_line_text")
        .datum(function(data) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });*/
}