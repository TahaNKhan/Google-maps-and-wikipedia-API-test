///////////////// Model ////////////////////////////

function placeModel(name, address, content){
	this.name = name;
	this.address = address;
	this.content = content;
	this.marker;
	this.infowindow;
};

placeModel.prototype.getLatLng = function(callback){
	var address = this.address.split(' ').join('+');
	var self = this;

	$.ajax({
		url:'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.address + '&key=AIzaSyBj85s9nxUYTRO_MfJ-cn8IGXcAof0tfpc'
	}).done(function(data,text,jq){

		var result = {lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng};
		if(callback){
			callback(result, self.name, self.address, self.content);
		}
		
	}).fail(function(){
		$('body').html('<div class="container"><h1>Google Map API Failed</h1></div>');
	});
	return;
}


placeModel.prototype.addMarkerAndInfoWindow = function (map){
	var self = this;

	this.getLatLng(function(data, name, address, content){

		self.marker = new google.maps.Marker({
			position: data,
			map : map,
			title : name
		});

		self.infowindow = new google.maps.InfoWindow({
			content: '<h3>' + name + '</h3>' + '<p>' + content + '</p>'
		});
		// place marker
		self.marker.setMap(map);

		// set listener to marker for infowindow
		self.marker.addListener('click', function() {
			self.infowindow.open(map, self.marker);
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){ self.marker.setAnimation(null); }, 760);
		});
	});
}

placeModel.prototype.removeMarker = function(x){
	console.log(x.setMap);
	x.marker.setMap(null);

}

placeModel.prototype.addMarker = function (maps1) {
	this.marker.setMap(maps1);
}


////////////////////// End Model //////////////////////
// var placeListVM = function(){};
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
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: {lat: 40.4239, lng: -86.9091},
		mapTypeControl: false,
		mapTypeControlOptions: {
			mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
			'styled_map']
		}
	});


	// Gets the lat and lng on a right click:
	// google.maps.event.addListener(map, "rightclick", function(event) {
	// 	var lat = event.latLng.lat();
	// 	var lng = event.latLng.lng();
	// 	console.log("lat: " + lat + ", lng: " + lng);
	// });

	// apply styles
	map.mapTypes.set('styled_map', styledMapType);
	map.setMapTypeId('styled_map');

	// data
	const data = [{
		"name" : "Union Purdue Hotel",
		"address" : "101 N Grant St, West Lafayette, IN",
		"content" : "Hotel with no refrigerator or microwave."
	},
	{
		"name" : "Blue Nile Restaurant",
		"address" : " 117 Northwestern Ave # 2, West Lafayette, IN",
		"content" : "Great Mediteranean Food"
	},
	{
		"name" : "Panda Express",
		"address" : "138 Northwestern Ave, West Lafayette, IN",
		"content" : "Worst Chinese Food."
	},
	{
		"name" : "West Lafayette Public Library",
		"address" : "208 W Columbia St, West Lafayette, IN",
		"content" : "They got books, lots and lots of books."
	},
	{
		"name" : "Subway",
		"address" : "135 S Chauncey Ave #2-F, West Lafayette, IN",
		"content" : "Questionable sandwiches at amazingly low prices."
	}];

	placeListVM = function(){
		var self = this;
		self.markers = new ko.observableArray([]);
		


		// add markers to map

		data.forEach(function (element){
			var x = new placeModel(element.name, element.address, element.content);
			self.markers().push(x);

		});

		for(var i = 0; i < self.markers().length; i++){
			self.markers()[i].addMarkerAndInfoWindow(map);
		}

		this.removeLocation = function(index){
			// console.log(index + ' ' + self.markers()[index].marker);
			self.markers()[index].marker.setMap(null);
			self.markers.splice(index,1);
		}



	};

	var placelist = new placeListVM()
	ko.applyBindings(placelist);	

	// add event listeners
	var x = 0;
	placelist.markers().forEach(function(element){
		$('#loc' + x).click(function(){
			// center on the marker
			map.setCenter(element.marker.getPosition());
			// make the marker bounce
			element.marker.setAnimation(google.maps.Animation.BOUNCE);
			// stop the bouce after once.
			setTimeout(function(){ element.marker.setAnimation(null); }, 760);
			// open the infowindow
			element.infowindow.open(map, element.marker);
		});
		x++;
	});


	////////// Test for removal
	placelist.removeLocation(2);
	console.log(placelist.markers());

}

