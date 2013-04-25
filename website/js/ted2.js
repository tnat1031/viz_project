var parseDate = d3.time.format("%Y-%m-%d").parse;

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

function drawOne(file_path, colname) {
  d3.csv(file_path, function(rows) {
		var datacols = d3.keys(rows[0]).filter(function(key) { return key == colname; });
		var datacol = datacols[0];
		var data = {name: datacol, values: []};
		rows.forEach(function(r) {
			var d = parseDate(r.date);
			var c = +r[datacol];
			data.values.push({date: d,
							  count: c});
		});
		var e = d3.select("#time_tab").selectAll(".viz_body");
		drawLine(e, data, "red");
	});
}

function addButtons(element, file_path, bnames_json) {
  element.data(bnames_json).enter()
    .append("button")
    .text(function(d) { return d.display; })
    .attr("class", "btn btn-danger btn-large btn-block")
    .on("click", function(d) { drawOne(file_path, d.name); });
}

function drawLine(element, data, color)  {
    d3.select("#linegraph_svg").remove();

	var tooltip = element
		.append("div")
		.attr("class", "tooltip_div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden"); 
		 
	var margin = {top: 20, right: 100, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;

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
		.attr("id", "linegraph_svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    	.append("text")
        	.attr("transform", "rotate(-90)")
        	.attr("y", 6)
        	.attr("dy", ".71em")
        	.style("text-anchor", "end")
        	.text("Number of Tweets");

    svg.append("path")
       .datum(data.values)
       .attr("class", "line")
       .attr("d", line)
       .style("stroke",  color);

    svg.selectAll("null_selection").data(data.values).enter().append("circle")
      	.attr("class", "tooltip_circle")
      	.attr("id", function(v) { return v.date; })
      	.attr("cx", function(v) { return x(v.date); })
      	.attr("cy", function(v) { return y(v.count); })
      	.attr("r", 5)
      	.attr("fill", color)
      	.on("mouseover", function(v) {
			return tooltip.style("visibility", "visible").text(Math.round(v.count*100)/100 + " tweets");
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
    
    for (var i = 0; i < json.length; i++) { 
      if (String(parseDate(json[i].date)) === String(parseDate(date))) {
      data = json[i];
      d3.select("#barchart_header").text("Vulgar Tweets on " + date);         
      }
    }
 
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
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
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