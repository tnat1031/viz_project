/* Draw the initial map */
function drawMap() {
	//drawDots();
	drawChloro();
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
	// We are assigning a color to each state. Color is pulled from our linear color scale f'n color()
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

function drawDots() {
	var search_terms = ['fuck','shit', 'bitch', 'ass', 	'asshole','dick', 'cunt', 
						'nigger', 'nigga', 'faggot',  'spic', 
						'slut', 'whore','fucker', 'mother fucker',
						'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',
						'twitter', 'tweet'];
	
	var mapData = [];
	
	// get the data
	d3.csv("data/tweets.csv", function(error, rows) {
              if (error) return console.warn(error);
                var data = [];
                
                
                rows.forEach(function(d) {
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
							//year: new Date(+d.year, 0, 1), // convert "Year" column to Date
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
	
	// add the search term to to each dot as a class
	// CHANGE THIS SO IT REFERS TO DATE- FACILITATE BRUSH
	d3.selectAll('.bubble')
		.data(data)
		// .enter()
		.attr('class', function(d){return ("bubble " + d.searchTerm)});
	
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
			d3.select('svg').select('g.bubbles').selectAll('circle')
				.style('stroke','#667FAF');
				
			// color 'term' dots red
			d3.select('svg').select('g.bubbles').selectAll('circle.bubble.'+term)
				.style('stroke','#FF0000');
				
			
			// This was a block to filter data based on term and then re-render the datamap. It doesnt work
			// It is failing to filter the data. It creates a second map same as the first.
			// It is also to slow to be a nice user feature
			// myData = [];
			// data.forEach(function(d) {
                // if (d.searchTerm == term) {
					// var o = d;
					// myData.push(d);
				// }
			// });
			//alert(myData[0].searchTerm);
			// d3.select('#mapDiv').selectAll('svg').remove()
			
			// map.options.data = myData;
			// map.render();
				
            
				
	}
	});
}
