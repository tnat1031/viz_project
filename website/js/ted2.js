var parseDate = d3.time.format("%Y-%m-%d").parse;
var parseHour = d3.time.format("%H").parse;
var parseLineDate = d3.time.format("%a %b %d %Y").parse;
var encodeDate = d3.time.format("%m_%d_%Y");

function addRadioFunctions(bnames_json) {
  var r = d3.select("#time_tab").selectAll("input")
    .on("click", function() {
      if(this.checked) {
        var time_scale_x = true;
        if (this.id == "by_hour") {
          var time_scale_x = false;
        }
        file_path = this.value;
        // disable click functionality on existing buttons
        d3.select("#time_tab").select("#series_toggle").selectAll("button")
          .on("click", null);
        // figure out which button is currently depressed
        var selected = d3.select("#time_tab").select("#series_toggle").selectAll(".active");
        console.log(selected.attr("id"));
        // draw a time series
        drawOne(this.value, selected.attr("id"), "linegraph_svg", 500, 960, true, time_scale_x);
        // upate buttons with click functions
        d3.select("#time_tab").select("#series_toggle").selectAll("button")
          .data(bnames_json)
          .on("click", function(d) {
            drawOne(file_path, d.name, "linegraph_svg", 500, 960, true, time_scale_x); });
          }
    });
}


function sortTwo(arr1, arr2) {
  arr1.sort();
  // sort arr2 relative to arr1
  // borrowed from http://answers.unity3d.com/questions/63520/sort-two-arrays.html
    var foundone;
    var tempobj;
    var tempfloat;
     
    foundone = true;
    while(foundone)
    {
      foundone = false;
      for(i = 0; i < arr2.length - 1; i++)
      {
        if(arr1[i] > arr2[i + 1])
        {
          tempobj = arr1[i + 1];
          tempfloat = arr2[i + 1];
          arr1[i + 1] = arr1[i];
          arr2[i + 1] = arr2[i];
          arr1[i] = tempobj;
          arr2[i] = tempfloat;
          foundone = true;
        }
      }
    } 
    
    return(arr2);
}

function drawOne(file_path, colname, id, h, w, overwrite, time_scale_x) {
  console.log(colname);
  d3.csv(file_path, function(rows) {
    console.log(rows);
    var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		var datacol = datacols[0];
		var data = {name: datacol, values: []};
		if (time_scale_x) {
      rows.forEach(function(r) {
  			var d = parseDate(r.date);
  			var c = +r[datacol];
  			data.values.push({date: d,
  							  count: c});
  		});
    }
    else {
      rows.forEach(function(r) {
        var d = parseHour(r.date);
        var c = +r[datacol];
        data.values.push({date: d,
                  count: c});
      });
    }
    console.log(data);
		var e = d3.select("#time_tab").selectAll(".viz_body");
		drawLine(e, id, data, "red", 5, h, w, overwrite, true, true, true);
	});
}

function drawTimeLine(file_path, element, id, chart) {
    d3.json(file_path, function(json) {
        var data = {name: "bargraph_dates", values: []};
        json.forEach(function(j) {
            var d = parseDate(j.date);
            var c = 50;
            data.values.push({date: d,
                              count: c});
        })
        drawLine(element, id, data, "red", 10, 100, 960, false, false, true, false);
        var timeline = d3.select("#"+id);
        timeline.selectAll("circle")
            .on("click", function() {
				if (chart == "map") {
					var datestring = this.id.substring(0,15);
					datestring = encodeDate(parseLineDate(datestring)).substring(1);
					document.getElementById("mapDate").innerHTML = datestring;
					changeMap();
				}
				else {
					drawBarChart(this.id, "red");
				}
        })
    });
}

function addLineButtons(element, file_path, bnames_json, id, h, w, overwrite, time_scale_x) {
  var group = element.append("div")
	.attr("class","btn-group")
    .attr("data-toggle","buttons-radio");
  
  group.selectAll("button").data(bnames_json).enter()
    .append("button")
    .text(function(d) { return d.display; })
    .attr("class", "btn btn-danger btn-large btn-block btn-primary")
    .attr("id", function(d) { return d.name; })
    .on("click", function(d) { drawOne(file_path, d.name, id, h, w, overwrite, time_scale_x); });
  
  d3.select("#time_tab").select(".btn")
	.attr("class","btn btn-danger btn-large btn-block btn-primary active");
}

function drawLine(element, id, data, color, radius, h, w, overwrite, y_axis_on, x_axis_on, tooltip_enabled) {
    if (overwrite) {
        d3.select("#"+id).remove();
    }

	var tooltip = element
		.append("div")
		.attr("class", "tooltip_div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden"); 
		 
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = w - margin.left - margin.right,
	height = h - margin.top - margin.bottom;


  var x = d3.time.scale()
    .range([0, width]);

	var y = d3.scale.linear()
    	.range([height, 0]);

    x.domain(d3.extent(data.values, function(d) { return d.date; }));
    y.domain([0, d3.max(data.values, function(d) { return d.count; })]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });
    
    var svg = element.append("svg")
		.attr("id", id)
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    if (x_axis_on) {
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    }

    if (y_axis_on) {
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Number of Tweets");
    }

    svg.append("path")
       .datum(data.values)
       .attr("class", "line")
       .attr("d", line)
       .style("stroke",  color);

    var circles = svg.selectAll("null_selection").data(data.values).enter().append("circle")
      	.attr("class", "tooltip_circle")
      	.attr("id", function(v) { return v.date; })
      	.attr("cx", function(v) { return x(v.date); })
      	.attr("cy", function(v) { return y(v.count); })
      	.attr("r", radius)
      	.attr("fill", color);

    if (tooltip_enabled) {
      	circles
        .on("mouseover", function(v) {
			return tooltip.style("visibility", "visible").text(Math.round(v.count*100)/100 + " tweets");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-300)+"px").style("left",(event.pageX-250)+"px");})
		.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});
    }
			      
		/*.append("text")
     	.attr("class", "tweet_line_text")
        .datum(function(data) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });*/
}


var chart_shown = false;

function drawBarChart(date, color) {
  // is there another chart already shown? if so, destroy it
  if (chart_shown) {    
    d3.select("#barchart_svg").remove();
  }

  var element = d3.select("#words_tab").select(".viz_body");
  
  var tooltip = element
    .append("div")
    .attr("class", "tooltip_div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden"); 
  
  var margin = {top: 20, right: 20, bottom: 75, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
   
  var x = d3.scale.ordinal()
    .rangeBands([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]); 
       
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
      
      
  var h1 = element.append("h1").attr("id", "barchart_header");
  
  var svg = element.append("svg")
    .attr("id", "barchart_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  d3.json("data/raw_tweet_distrib_by_day.json", function(error, json) {
    
    if (error) return console.warn(error);
    
    data = null;

    if (date==null) {
        // just use the first element in json
        data = json[0];
    }
    else {
        // figure out which date to use
        for (var i = 0; i < json.length; i++) {
            if (String(parseDate(json[i].date)) === date) {
                data = json[i];
                break;
            }
        }
    }

    d3.select("#barchart_header").text("Vulgar Tweets on " + data.date);
 
    x.domain(data.search_term);
    y.domain([0, d3.max(data.count, function(d) { return +d; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
        
    svg.selectAll("text")
      .attr("transform", function(d) {
        return "rotate(45)translate(" + this.getBBox().width/2 + "," +
            this.getBBox().height/2 + ")";
      });

    counts = sortTwo(data.search_term, data.count);
        
    svg.selectAll("rect")
      .data(counts)
      .enter().append("rect")
      .attr("fill", color)
      .attr("class", "barchart_bar")
      .attr("x", function(d, i) { return x(i); })
      .attr("y", function(d) { return y(+d); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(+d); } )
      .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(+d  + " tweets"); })
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-300)+"px").style("left",(event.pageX-250)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
      
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Tweets");
        
    });
    
    chart_shown = true;
    
}