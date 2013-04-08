/* Draw the initial map */
function drawMap() {
	drawDots();
	//drawChloro();
}

/*
* Grabs the JSON data embedded in the HTML doc and parses to object
* To be used for Chloropleth
*/
function processJSON() {
	// grab the JSON string from its hidden div and parse with builtin
	var JSON_string  = document.getElementById('chloroJSON').innerHTML;
	var jdata = JSON.parse(JSON_string);
	return jdata;
}

function drawChloro() {
	// grab the tweet count data
	// data format: { "NY": {"tweets": 1977, "fillKey": "NY", "perCapita": 2.999999e-18 }, MA:... }
	var stateData = processJSON();
	
	// find the min, max tweet counts.
	// Use d3 to create a f'n color() that maps tweet counts -> colors via linear scale
	var numsArray = [];
	for (state in stateData) {
		numsArray.push(stateData[state].perCapita);
	}
	maxData = d3.max(numsArray)
	var color = d3.scale.linear()
		.domain([0, maxData])
		.range(["white", "red"]);
	
	// load an object detailing the fill levels (color map)
	// We are assigning a color to each state, based on tweets per capita
	// Color is pulled from our linear color scale f'n color()
	// Object format: { {AZ:ffffff}, {MA: #ff0000} }
	var myfills = JSON.parse('{"defaultFill": "#BADA55"}')
	for (state in stateData) {
		var myColor = color(stateData[state].perCapita)
		myfills[state] = myColor;
	}
	
	/* Backbone style execution */
	  var map = new Map({
		  scope: 'usa',
		  el: $('#mapDiv'),
		  geography_config: { 
			highlightBorderColor: '#222',
			highlightOnHover: true,
			popupTemplate: _.template('<div class="hoverinfo"><strong><%= geography.properties.name %></strong> <% if (data.tweets) { %><hr/>  Tweet Count: <%= data.tweets %> <% } %><% if (data.perCapita) { %><hr/>  Tweets Per Capita: <%= data.perCapita %> <% } %></div>')
		  },
		  // this is our fill color map object from earlier
		  fills: myfills,
		  // our data, with tweet counts and fill keys
		  data: stateData
		});

   map.render();
   
   d3.select('#mapDiv').selectAll('svg')
       .on("click",	switchToDots);
}

function switchToDots() {
	d3.select('#mapDiv').selectAll('div')
	    .remove();
	
	drawDots();
}

function switchToChloro() {
	d3.select('#mapDiv').selectAll('div')
	    .remove();
	d3.selectAll('#sterms').selectAll('span').remove();
	drawChloro();
}

function drawDots() {
	var search_terms = ['all','fuck','shit', 'bitch', 'ass', 'asshole','dick', 'cunt', 
						'nigger', 'nigga', 'faggot',  'spic', 
						'slut', 'whore','fucker', 'mother fucker',
						'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',
						'twitter', 'tweet'];
	
	var parseDate = d3.time.format("%Y-%m-%d").parse;
	var encodeDate = d3.time.format("%b%d%Y");
	
	var mapData = [];
	
	// get the data
	d3.csv("data/tweets.csv", function(error, rows) {
              if (error) return console.warn(error);
                var data = [];
                
                var year = 2013;
				var month = 3;
				var day = 1;
				
                rows.forEach(function(d) {
                    
					year = d.year
					month = "0".concat(d.month)
					if (d.day < 10) {day = "0".concat(d.day)}
					else {day = d.day}
					thisTextDate = year.concat(month,day)
					
					var o = {radius: 1,
							//city: d.city,
							//areaCode: +d.areaCode,
							country: "USA", 
							fillKey: "USA",
							//state: d.region,
							longitude: +d.long,
							//postalCode: +d.lat,
							latitude: +d.lat,
							//TODO- fix year- Make an exact date object.
							author: d.author,
							textDate: thisTextDate,
							date: new Date(+d.year, +d.month, +d.day), // convert "Year" column to Date
							text: d.text,
							searchTerm: d.search_term,
							id: +d.id};
					
                    data.push(o);
                });
	
	mapData = data;
	
	//Draw the datamap
    var map = new Map({
        scope: 'usa',
		el: $('#mapDiv'),
        bubbles: mapData,
        bubble_config: {
            borderColor: '#667FAF',
			popupTemplate: _.template([
					'<div class="hoverinfo"><strong><%= data.author %></strong>',
					'<br/>Text: <%= data.text %>',
					'<br/>Search Term: <%= data.searchTerm %>',
					'</div>'].join(''))
        },
        geography_config: {
            popupOnHover: false,
            highlightOnHover: false
        },
        fills: {
            'USA': '#1f77b4',
            defaultFill: '#BADA55'
        },
        data: {
            'USA': {fillKey: 'USA'}
        }
    });
	map.render();
	
	// add the date to each dot as a class
	// NOTE- D3 can NOT select a ddate if it starts with a number. Throw a 'b' on there!
	d3.selectAll('.bubble')
		.data(data)
		.attr('class', function(d){return ('b'+d.textDate)});
	
	// getting started on a series of checkboxes for highlighting
	// d3 is hard.
	d3.select('#sterms')
			 // .attr('height', '20px')
			 // .append('form')
			.selectAll('span')
			.data(search_terms)
			.enter()
					.append('span').text(function(d){return d})
					.style('border','2px solid grey')
					.style('color','black')
					.style('background-color','white')
					.style('margin', '3px')
					.style('padding', '3px')
					//.append('input')
					//.attr('type','checkbox')
					.attr('class',function(d){return d+' button'})
					.on("click", highlightTweets);

	// });
// }
	
	function highlightTweets(term) {
			// Unselect the undesired span buttons
			d3.selectAll('#sterms').selectAll('span')
				.style('color','black')
				.style('background-color','white')
			
			// Select the desired span button
			d3.selectAll('#sterms').select('span.'+term+'.button')
				.style('background-color','grey')
				.style('color','white');
			
			// color unselected dots blue
			//d3.select('svg').select('g.bubbles').selectAll('circle')
			//	.style('stroke','#667FAF');
				
			// color 'term' dots red
			//d3.select('svg').select('g.bubbles').selectAll("circle.20130407")
			//	.style('stroke','#FF0000');
				
			
			// Filter the data displayed on the map, and redraw
			// Replaces recolor deactivated above. Does not require selection by class
			var myData = [];
			data.forEach(function(d) {
                if (d.searchTerm == term) {
					var o = d;
					myData.push(d);
				}
			});
			if (term == 'all') {myData = data;}
			d3.select('#mapDiv').selectAll('svg').remove()
			map.options.bubbles = myData;
			map.render();
			// Ok. My filter function IS working correctly, BUT:
			//     The hoverover tooltip references data (full set) not mapData (what is actually being rendered)
			//	   Tried to switch it to mapData, but it claims this is not defined (no idea why- should be within scope?)
			//     This causes tooltip to get out of sync with actual dots, once tweets are filtered
			//     Dont want user to think filter itself was messed up, so removing the tooltip after filtering
			d3.select('#mapDiv').selectAll('.hoverover').remove()
			
			// have to reset those bubble classes, since we redrew them.
			d3.selectAll('.bubble')
				.data(myData)
				.attr('class', function(d){return ('b'+d.textDate)});
			// have to reset the map click event as well
			// this is a hack. Should set click event as part of map draw
			d3.select('#mapDiv').selectAll('svg')
				.on("click", switchToChloro);
	}
	d3.select('#mapDiv').selectAll('svg')
       .on("click",	switchToChloro);
	});
}
