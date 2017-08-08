function placeModel(name, address, content){
	this.name = name;
	this.address = address;
	this.content = content;

};


placeModel.prototype.addMarkerAndInfoWindow = function (maps1, callback){
	this.getLatLng(function(data){
		var marker = new google.maps.Marker({
			position: data,
			map : maps1,
			title : this.title
		});
		var infowindow = new google.maps.InfoWindow({
			content: '<h3>' + marker.title + '</h3>' + '<p>' + this.content + '</p>'
		});
			// place marker
			marker.setMap(maps1);

			// set listener to marker for infowindow
			marker.addListener('click', function() {
				infowindow.open(maps1, marker);
			});
		});
}

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