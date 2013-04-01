/* Draw the map */
window.onload = function() {
	
	// load the data
	var myData = processJSON();
	
	// Could not get this to work...
	/*******
	var tweets = d3.csv("tweets2.csv", function(d) {
		return {
			radius: 1,
			city: d.city,
			areaCode: +d.areaCode,
			country: "USA", // convert "Length" column to number
			fillKey: "USA",
			state: d.region,
			longitude: +d.longitude,
			postalCode: +d.postalCode,
			latitude: +d.latitude,
			author: d.author,
			//TODO- fix year- Make an exact date object.
			year: new Date(+d.year, 0, 1), // convert "Year" column to Date
			text: d.text,
			searchTerm: d.search_term,
			id: +id
		};
	}, function(error, rows) {
		console.log(rows);
	});
	********/
	// Draw the datamap
    $("#container1").datamap({
        scope: 'usa',
        bubbles: myData.mydata,
        bubble_config: {
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
	
}
/*
* Grabs the JSON data embedded in the HTML doc and parses to object
*/
function processJSON() {
	// grab the JSON string from its hidden div and parse with builtin
	var JSON_string  = document.getElementById('JSON').innerHTML;
	var jdata = JSON.parse(JSON_string);
	return jdata;
}