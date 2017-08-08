///////////////// Model ////////////////////////////

function placeModel(name, address, content){
	this.name = name;
	this.address = address;
	this.content = content;

};

placeModel.prototype.getLatLng = function(callback){
	address = this.address.split(' ').join('+');
	var result;
	$.ajax({
		url:'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.address + '&key=AIzaSyBj85s9nxUYTRO_MfJ-cn8IGXcAof0tfpc'
	}).done(function(data){

		result = {lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng};
		if(callback)
			callback(result);
		
	});
	return;
}


placeModel.prototype.addMarkerAndInfoWindow = function (maps1, callback){
	this.getLatLng(function(data){
		var marker = new google.maps.Marker({
			position: data,
			map : maps1,
			title : this.title
		});
		var infowindow = new google.maps.InfoWindow({
			content: '<h3>' + this.title + '</h3>' + '<p>' + this.content + '</p>'
		});
			// place marker
			marker.setMap(maps1);

			// set listener to marker for infowindow
			marker.addListener('click', function() {
				infowindow.open(maps1, marker);
			});
		});
}



////////////////////// End Model //////////////////////

// Initialize the map
function initMap() {
	// map styles
	var styledMapType = new google.maps.StyledMapType([
	{
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#242f3e"
		}
		]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#746855"
		}
		]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [
		{
			"color": "#242f3e"
		}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#d59563"
		}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#d59563"
		}
		]
	},
	{
		"featureType": "poi.business",
		"stylers": [
		{
			"visibility": "off"
		}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#263c3f"
		}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text",
		"stylers": [
		{
			"visibility": "off"
		}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#6b9a76"
		}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#38414e"
		}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": [
		{
			"color": "#212a37"
		}
		]
	},
	{
		"featureType": "road",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#9ca5b3"
		}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#746855"
		}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
		{
			"color": "#1f2835"
		}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#f3d19c"
		}
		]
	},
	{
		"featureType": "transit",
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#2f3948"
		}
		]
	},
	{
		"featureType": "transit.station",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#d59563"
		}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
		{
			"color": "#17263c"
		}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
		{
			"color": "#515c6d"
		}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.stroke",
		"stylers": [
		{
			"color": "#17263c"
		}
		]
	}
	],
	{name: 'Styled Map'});

	// initialize map
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: {lat: 40.4239, lng: -86.9091},
		mapTypeControl: false,
		mapTypeControlOptions: {
			mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
			'styled_map']
		}
	});
	google.maps.event.addListener(map, "rightclick", function(event) {
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();
		console.log("lat: " + lat + ", lng: " + lng);
	});
	map.mapTypes.set('styled_map', styledMapType);
	map.setMapTypeId('styled_map');

	// data in json
	var data = '{	"places" : [{		"name" : "Union Purdue Hotel",		"address" : "101 N Grant St, West Lafayette, IN",		"content" : "Hotel with no refrigerator or microwave."	},	{		"name" : "Blue Nile Restaurant",		"address" : " 117 Northwestern Ave # 2, West Lafayette, IN",		"content" : "Great Mediteranean Food"	},	{		"name" : "Panda Express",		"address" : "138 Northwestern Ave, West Lafayette, IN",		"content" : "Worst Chinese Food."	},	{		"name" : "West Lafayette Public Library",		"address" : "208 W Columbia St, West Lafayette, IN",		"content" : "They books, lots and lots of books."	},	{		"name" : "Subway",		"address" : "135 S Chauncey Ave #2-F, West Lafayette, IN",		"content" : "Questionable sandwiches at amazingly low prices."	}]}';
	data = JSON.parse(data);
	var placeListVM = function(){
		this.markers = new ko.observableArray([]);
		data.places.forEach(function (element){
			var x = new placeModel(element.name, element.address, element.content);
			this.markers().push(x);
		});
	// markers().arrayForEach(function(el){
	// 	el.addMarkerAndInfoWindow(map);
	// });
	for(var i = 0; i < markers().length; i++){
		markers()[i].addMarkerAndInfoWindow(map);
	}

};


placeListVM();



}

