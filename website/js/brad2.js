function drawScatter(file_path, colname) {
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	d3.csv(file_path, function(rows) {
		var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		var datacol = datacols[0];
		var data = {name: datacol, values: []};
		rows.forEach(function(r) {
			var d = +r.percent_bachelors_or_higher;
			var c = +r[datacol];
			data.values.push({tweets: d,
							  factor2: c});
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

function drawScatterPlot (element, data, name, color)  {
    d3.select("#social_svg").remove();

	var tooltip = element
		.append("div")
		.attr("class", "tooltip_div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden"); 
		 
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
        	.text("Percent College Educated");

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
      	.attr("fill", color)
      	.on("mouseover", function(v) {
			return tooltip.style("visibility", "visible").text(Math.round(v.tweets*100)/100 + " tweets\n" + Math.round(v.factor2*100)/100 + " " + name)
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