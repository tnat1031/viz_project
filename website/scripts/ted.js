function drawCharts() {
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
                
                
            var tooltip = d3.select("body")
						.append("div")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "hidden")
						.text("a simple tooltip");

            var svg = d3.select("body").append("svg")
            		 .attr("class", "plot_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    
                
            
            d3.csv("../tweets_per_day.csv", function(error, rows) {
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
		               		.attr("fill", "blue")
		               		.attr("r", 5)
		               		.on("mouseover", function(){return tooltip.style("visibility", "visible");})
		               		.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
										.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
               		
               		
									
							//	svg.selectAll(")
                
            });
}