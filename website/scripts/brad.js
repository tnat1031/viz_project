/* Draw the map */
function drawMap() {
	var search_terms = ['fuck','shit', 'bitch', 'ass', 	'asshole','dick', 'cunt', 
						'nigger', 'nigga', 'faggot',  'spic', 
						'slut', 'whore','fucker', 'mother fucker',
						'kill', 'beat', 'rape', 'fight', 'stab', 'shoot',
						'twitter', 'tweet'];
	
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
	
	//Draw the datamap
    var map = new Map({
        scope: 'usa',
		el: $('#mapDiv'),
        bubbles: data,
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
	d3.selectAll('.bubble')
		.data(data)
		// .enter()
		.attr('class', function(d){return ("bubble " + d.searchTerm)});
	
	// getting started on a series of checkboxes for highlighting
	// d3 is hard.
	d3.select('#sterms')
			.append('div')
			.append('form')
			.selectAll('input')
			.data(search_terms)
			.enter()
					.append('span').text(function(d){return d})
					.append('input')
					.attr('type','checkbox')
					.attr('class',function(d){return d+' noChecked'})
					.on("click", click);
	});
}

function click(term) {
			// trying to put in some logic so I can UNCHECK boxes. But now time for sleep
			var checked_boxes = d3.select('#sterms').select('input.'+term+'.yesChecked')
			checked_boxes.attr('class',term+' noChecked');
			checked_boxes.attr('checked', 'true');
			
			var unchecked_boxes = d3.select('#sterms').select('input.'+term+'.noChecked');
			unchecked_boxes.attr('class',term+' yesChecked');
			checked_boxes.attr('checked', 'true');
			
			// boxes = document.getElementsByClassName(term+' yesChecked');
			// for (box in boxes) {
				// if (boxes[box].checked == true) {
					// alert('yaaaah');
				// }
			// }
			
			// color 'term' dots red
			d3.select('svg').select('g.bubbles').selectAll('circle.bubble.'+term)
				.style('stroke','#FF0000');
				//.data(data)
				//.style('Fill','#FF0000');
			
			//alert(term);
			//tweetData.forEach(function (d) {alert(d.author)})
			//data 	
	}