/*
* Grabs the JSON data embedded in the HTML doc and parses to object
*/
function processJSON() {
	// grab the JSON string from its hidden div and parse with builtin
	var JSON_string  = document.getElementById('JSON').innerHTML;
	var jdata = JSON.parse(JSON_string);
	return jdata;
}

/*
* Draw the map
*/
window.onload = function() {
	// grab the tweet count data
	// data format: { "NY": {"tweets": 1977, "fillKey": "NY" }, MA:... }
	var stateData = processJSON();
	
	// find the min, max tweet counts.
	// Use d3 to create a f'n color() that maps tweet counts -> colors via linear scale
	var numsArray = [];
	for (state in stateData) {
		numsArray.push(stateData[state].tweets);
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
		var myColor = color(stateData[state].tweets)
		myfills[state] = myColor;
	}
	
	/* Backbone style execution */
	  var map = new Map({
		  scope: 'usa',
		  el: $('#container1'),
		  geography_config: { 
			highlightBorderColor: '#222',
			highlightOnHover: true,
			popupTemplate: _.template('<div class="hoverinfo"><strong><%= geography.properties.name %></strong> <% if (data.tweets) { %><hr/>  Tweet Count: <%= data.tweets %> <% } %></div>')
		  },
		  // this is our fill color map object from earlier
		  fills: myfills,
		  // our data, with tweet counts and fill keys
		  data: stateData
		});

   map.render();
}