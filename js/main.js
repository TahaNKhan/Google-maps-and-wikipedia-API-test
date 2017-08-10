///////////////// Model ////////////////////////////

function placeModel(name, address, content, id){
	this.name = name;
	this.address = address;
	this.content = content;
	this.id = id;

};

placeModel.prototype.getLatLng = function(callback){
	// replace the spaces in address with +s
	var address = this.address.split(' ').join('+');
	// Have access to 'this' object.
	var self = this;

	// use google's geocode api to get lat long
	$.ajax({
		url:'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.address + '&key=AIzaSyBj85s9nxUYTRO_MfJ-cn8IGXcAof0tfpc'
	}).done(function(data,text,jq){
		// get the result and use callback
		var result = {lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng};
		if(callback){
			self.lnglat = result;
			callback(result, self.name, self.address, self.content);
		}

	}).fail(function(){
		// on fail set this.
		$('body').html('<div class="container"><h1>Google Map API Failed</h1></div>');
	});
	return;
}


placeModel.prototype.addMarkerAndInfoWindow = function (markers, map){
	var self = this;

	self.getLatLng(function(data, name, address, content){

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
		self.marker.setAnimation(google.maps.Animation.DROP);


		// set listener to marker for infowindow
		self.marker.addListener('click', function() {
			// close all other infowindows
			if(markers){
				markers().forEach(function(element){
					element.infowindow.close();
				});
			}
			self.infowindow.open(map, self.marker);
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){ self.marker.setAnimation(null); }, 760);
		});
	});
}

placeModel.prototype.showMarker = function(map){
	this.marker.setMap(map);
}

placeModel.prototype.hideMarker = function(){
	this.marker.setMap(null);
}

placeModel.prototype.getPosition = function(){
	return this.marker.getPosition();
}

placeModel.prototype.getMarker = function(){
	return this.marker;
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

		// apply styles
		map.mapTypes.set('styled_map', styledMapType);
		map.setMapTypeId('styled_map');

	// data
	const data = [{
		"name" : "Union Purdue Hotel",
		"address" : "101 N Grant St, West Lafayette, IN",
		"content" : "Hotel with no refrigerator or microwave.",
		"id" : "loc0"
	},
	{
		"name" : "Blue Nile Restaurant",
		"address" : " 117 Northwestern Ave # 2, West Lafayette, IN",
		"content" : "Great Mediteranean Food",
		"id" : "loc1"
	},
	{
		"name" : "Panda Express",
		"address" : "138 Northwestern Ave, West Lafayette, IN",
		"content" : "Worst Chinese Food.",
		"id" : "loc2"
	},
	{
		"name" : "West Lafayette Public Library",
		"address" : "208 W Columbia St, West Lafayette, IN",
		"content" : "They got books, lots and lots of books.",
		"id" : "loc3"
	},
	{
		"name" : "Subway",
		"address" : "135 S Chauncey Ave #2-F, West Lafayette, IN",
		"content" : "Questionable sandwiches at amazingly low prices.",
		"id" : "loc4"
	}];

	var placeListVM = function(){
		var self = this;

		

		self.markers = new ko.observableArray([]);
		self.search = ko.observable('');


		self.searchResults = ko.computed(function(){
			var q = self.search();
			if(q != ''){
				return self.markers().filter(function(i){
					return i.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
				});
			}else{
				return self.markers();	
			}
		});
		// everytime the search happens, update the map
		self.search.subscribe(function(newValue){

			var results = self.searchResults();

			// center on first result
			if(results.length > 0){
				map.setCenter(results[0].marker.getPosition());
			}

			// hide unneeded markers
			self.markers().forEach(function(mark){
				if(!results.includes(mark))
					mark.hideMarker();
				else{
					mark.showMarker(map);
					placelist.markers().forEach(function(ele){
						ele.infowindow.close();
					});
					// hide infowindows
					$('#' + mark.id).click(function(){
						map.setCenter(mark.getPosition());
						mark.getMarker().setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){ mark.getMarker().setAnimation(null); }, 760);
						// close all infowindows
						placelist.markers().forEach(function(ele){
							ele.infowindow.close();
						});
						// open the infowindow thats relevant
						mark.infowindow.open(map, mark.marker);
					});

				}
			});


		});

		// add data

		data.forEach(function (element){
			var x = new placeModel(element.name, element.address, element.content, element.id);
			self.markers().push(x);

		});

		for(var i = 0; i < self.markers().length; i++){
			self.markers()[i].addMarkerAndInfoWindow(this.markers,map);
		}




	}	



	var placelist = new placeListVM()
	ko.applyBindings(placelist);	

	// add event listeners
	function addEventListenersOnSideBar(){
		var x = 0;
		placelist.markers().forEach(function(element){
			// $('#loc' + x).html() == element.name;
			// element.showMarker(map);
			$('#loc' + x).click(function(){
				// center on the marker
				map.setCenter(element.marker.getPosition());
				// make the marker bounce
				element.marker.setAnimation(google.maps.Animation.BOUNCE);
				// stop the bouce after once.
				setTimeout(function(){ element.marker.setAnimation(null); }, 760);
				// close all other infowindows
				placelist.markers().forEach(function(ele){
					if(ele.infowindow)
						ele.infowindow.close();
				});

				// open the infowindow
				// if($('#loc' + x).html() == element.name){
					element.infowindow.open(map, element.marker);
				// }

			});
			x++;
		});
	}
	addEventListenersOnSideBar();




}

