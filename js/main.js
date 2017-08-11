function gMapsFail(){
	$('body').html('<div class="container"><h1>Something went wrong trying to reach Google Maps</h1></div>');
}
///////////////// Model ////////////////////////////

function placeModel(name, address, content, id){
	this.name = name;
	this.address = address;
	this.content = content;
	this.id = id;

}

placeModel.prototype.getLatLng = function(callback){
	// replace the spaces in address with +s
	var address = this.address.split(' ').join('+');
	// Have access to 'this' object.
	var self = this;

	// use google's geocode api to get lat long
	$.ajax({
		url:'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBj85s9nxUYTRO_MfJ-cn8IGXcAof0tfpc'
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
};


placeModel.prototype.init = function (markers, map){
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

		self.getContent(self.name);

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
};

// wikipedia api
placeModel.prototype.getContent = function(name, callback){
	var self = this;
	var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&origin=*&exintro=&explaintext=&titles="+ name.split(' ').join('%20') +"&redirects";
	$.ajax({
		url: url
	}).done(function(data){
		var pages = data.query.pages;
		var pagekeys = Object.keys(pages)[0];
		self.content = pages[pagekeys].extract;
		self.infowindow.setContent('<h3>' + name + '</h3>' + '<p>' + self.content.split('.')[0] + '</p>' + '<p> -From wikipedia</p>');
	}).fail(function(){
		alert('Couldn\'t load wikipedia API');
	});
};

placeModel.prototype.showMarker = function(map){
	this.marker.setMap(map);
};

placeModel.prototype.hideMarker = function(){
	this.marker.setMap(null);
};

placeModel.prototype.getPosition = function(){
	return this.marker.getPosition();
};

placeModel.prototype.getMarker = function(){
	return this.marker;
};


////////////////////// End Model //////////////////////

// Initialize the map
function initialize() {
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
		zoom: 5,
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
	var data = [{
		"name" : "Chicago",
		"address" : "Chicago, IL",
		"content" : "Great City",
		"id" : "loc0"
	},
	{
		"name" : "Atlanta",
		"address" : "Atlanta, GA",
		"content" : "Olympics happened here sometime ago",
		"id" : "loc1"
	},
	{
		"name" : "Indianapolis",
		"address" : "Indianapolis, IN",
		"content" : "Indy 500 happens here",
		"id" : "loc2"
	},
	{
		"name" : "Detroit",
		"address" : "Detroit, MI",
		"content" : "'Murican car companies here",
		"id" : "loc3"
	},
	{
		"name" : "New York City",
		"address" : "New York City, NY",
		"content" : "Meh City",
		"id" : "loc4"
	}];

	// view model
	var placeListVM = function(){
		
		var self = this;
		// ko array for placemodels
		self.markers = new ko.observableArray([]);
		self.search = ko.observable('');

		// Get the search from
		self.searchResults = ko.computed(function(){
			var q = self.search();
			self.markers().forEach(function(ele){
				ele.infowindow.close();
			});
			if(q !== ''){
				return self.markers().filter(function(i){
					if(i.name.toLowerCase().indexOf(q.toLowerCase()) >= 0){
						i.showMarker(map);
						return i.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
					}else{
						i.hideMarker();
						return i.name.toLowerCase().indexOf(q.toLowerCase()) >= 0;
					}
				});
			}else{
				self.markers().forEach(function(i){
					i.showMarker(map);
				});
				return self.markers();	
			}
		});

		self.addEventListener = function(data, event){
			self.markers().forEach(function(ele){
				ele.infowindow.close();
			});	
			data.infowindow.open(map, data.marker);

		};



		// add data

		data.forEach(function (element){
			var x = new placeModel(element.name, element.address, element.content, element.id);
			self.markers().push(x);

		});

		for(var i = 0; i < self.markers().length; i++){
			self.markers()[i].init(this.markers,map);
		}


		// self.addInitialEventListenersOnSideBar = function(){

		// 	var x = 0;
		// 	self.markers().forEach(function(element){
		// 		// $('#loc' + x).html() == element.name;
		// 		// element.showMarker(map);
		// 		$('#loc' + x).click(function(){
		// 			// center on the marker
		// 			map.setCenter(element.marker.getPosition());
		// 			// make the marker bounce
		// 			element.marker.setAnimation(google.maps.Animation.BOUNCE);
		// 			// stop the bouce after once.
		// 			setTimeout(function(){ element.marker.setAnimation(null); }, 760);
		// 			// close all other infowindows
		// 			self.markers().forEach(function(ele){
		// 				if(ele.infowindow)
		// 					ele.infowindow.close();
		// 			});
		// 			element.infowindow.open(map, element.marker);

		// 		});
		// 		x++;
		// 	});


		// };




	};



	var placelist = new placeListVM();
	ko.applyBindings(placelist);	
	// placelist.addInitialEventListenersOnSideBar();






}

