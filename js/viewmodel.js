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





