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
        
    var parseDate = d3.time.format("%Y-%m-%d").parse;
        
    var h1 = d3.select("body").append("h1").attr("id", "barchart_header");
		
		var svg = d3.select("body").append("svg")
			.attr("id", "barchart_svg")
			.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           
    d3.json("data/raw_tweet_distrib_by_day.json", function(error, json) {
    		if (error) return console.warn(error);
    		
    		data = null;
    		
    		for (var i = 0; i < json.length; i++) {	
    			if (String(parseDate(json[i].date)) == date) {
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
					 
					 var margin = {top: 20, right: 100, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
            
            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);
            
            var parseDate = d3.time.format("%Y-%m-%d").parse;
			var encodeDate = d3.time.format("%Y%m%d");
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.count); });
                
            var color = d3.scale.category10();
                

            var svg = d3.select("body").append("svg")
            		 .attr("id", "linegraph_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    
                
            
            d3.csv("data/norm_tweets_per_day.csv", function(error, rows) {
              if (error) return console.warn(error);
                color.domain(d3.keys(rows[0]).filter(function(key) { return key !== "date"; }));
                
                
                rows.forEach(function(d) {
    							d.date = parseDate(d.date);
  							});
                
                var tweets = color.domain().map(function(name) {
						    return {
						      name: name,
						      values: rows.map(function(d) {
						        return {date: d.date, count: +d[name]};
						      })
						    };
						  });
                
                x.domain(d3.extent(rows, function(d) { return d.date; }));
                y.domain([
						    d3.min(tweets, function(c) { return d3.min(c.values, function(v) { return v.count; }); }),
						    d3.max(tweets, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
						  ]);
            
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
                  
							var tweet = svg.selectAll(".line")
					      .data(tweets)
					    .enter().append("g")
					      .attr("class", "tweet");
					                   
                  
                  tweet.append("path")
						      .attr("class", "line")
						      .attr("d", function(d) { return line(d.values); })
						      .style("stroke", function(d) { return color(d.name); });
						      
						     tweet.append("text")
						     	.attr("class", "tweet_line_text")
						      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
						      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
						      .attr("x", 3)
						      .attr("dy", ".35em")
						      .text(function(d) { return d.name; });
						      

						      
						     // this is a hack to get the line graph colors and point
						     // colors to match up. need to fix
						     
						     colors = ["#1f77b4", "#ff7f0e", "#2ca02c"]
						     ind = 0;
						      
						      tweets.forEach(function(d) {
						      	svg.selectAll("null_selection").data(d.values).enter().append("circle")
						      	.attr("class", "tooltip_circle")
						      	.attr("id", function(v) { return v.date; })
						      	.attr("cx", function(v) { return x(v.date); })
						      	.attr("cy", function(v) { return y(v.count); })
						      	.attr("r", 5)
						      	.attr("fill", colors[ind])
						      	.on("mouseover", function(v){
									var textDate = (encodeDate(v.date));
									d3.select('#mapDiv').select('svg').select('g.bubbles').selectAll('circle.b'+encodeDate(v.date))
										.style('stroke','#FF0000');
									return tooltip.style("visibility", "visible").text(Math.round(v.count*100)/100 + " tweets");
								})
		               		.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
										.on("mouseout", function(){
											d3.select('#mapDiv').select('svg').select('g.bubbles').selectAll('circle')
												.style('stroke','#667FAF');
											return tooltip.style("visibility", "hidden");
										})
										.on("click", function(v) {  drawBarChart(v.date); });
										
									ind = ind + 1;
						      	});

            });	
	
	}
