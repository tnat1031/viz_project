var chart_shown = false;

function drawCharts() {
            
           
       
		
		drawLineGraph(); 
           //drawBarChart();
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
		
		return(arr2)
}



function drawBarChart (date) {		
		// is there another chart already shown? if so, destroy it
		if (chart_shown) {		
			d3.select("#barchart_svg").remove()
		}
		
		var tooltip = d3.select("body")
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
        
    var h1 = d3.select("body").append("h1").attr("id", "barchart_header");
		
		var svg = d3.select("body").append("svg")
			.attr("id", "barchart_svg")
			.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           
    d3.json("data/tweet_distrib_by_day.json", function(error, json) {
    		if (error) return console.warn(error);
    		
    		console.log(json);
    		data = null;
    		
    		for (var i = 0; i < json.length; i++) {
    			if (json[i].date == date) {
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
			  		.attr("class", "barchart_bar")
			    .attr("x", function(d, i) { return x(i); })
			    .attr("y", function(d) { return y(+d); })
			    .attr("width", x.rangeBand())
			    .attr("height", function(d) { return height - y(+d); } )
			    .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(+d 	+ " tweets"); })
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
                  .text("Number of vulgar Tweets");
				
		});
    	
    	chart_shown = true;
		
}


function drawLineGraph () {
					var tooltip = d3.select("body")
						.append("div")
						.attr("class", "tooltip_div")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "hidden"); 
					 
					 var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
            
            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);
            
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(parseDate(d[0])); })
                .y(function(d) { return y(d[1]); });
                

            var svg = d3.select("body").append("svg")
            		 .attr("id", "linegraph_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    
                
            
            d3.csv("data/tweets_per_day.csv", function(error, rows) {
              if (error) return console.warn(error);
                var data = [];
                
                
                rows.forEach(function(d) {
                    var o = [d.date, +d.num_tweets];
                    data.push(o);
                });
                
                
                
                x.domain(d3.extent(data, function(d) { return parseDate(d[0]); }));
                y.domain([0, d3.max(data, function(d) { return +d[1]; })]);
            
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
                  .text("Number of vulgar Tweets");
                  
                  svg.append("path")
                      .datum(data)
                      .attr("class", "line")
                      .attr("d", line);
                      
                  svg.selectAll("circle").data(data).enter()
		               		.append("circle")
		               		.attr("class", "tooltip_circle")
		               		.attr("cx", function(d) { return x(parseDate(d[0])); })
		               		.attr("cy", function(d) { return y(d[1]); })
		               		.attr("r", 5)
		               		.attr("id", function(d) { return parseDate(d[0]); })
		               		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d[1] + " tweets"); })
		               		.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
										.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
										.on("click", function(d) {  drawBarChart(d[0]); });

                
            });	
	
	}
