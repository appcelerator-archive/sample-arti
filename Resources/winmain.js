/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//This is the main window for the flow of our application
var win = Ti.UI.currentWindow;

Ti.include("dates.js");	//This holds date formatting functions for "pretty dates"

//This starts the Facebook module. We instantiate it here to make the
//facebook module available to register against. We want to require the
//user to login prior to seeing any action here
var facebook = require("ti.facebook");
	facebook.appid = "161605913888734";
	//facebook.permissions = ["places"];

var centerLoc; //This is our center location based on geolocation
var currLocation = {lat:0, lng:0}; 	//Out initial latitude and longitude that will be passed up to ensure that we always ahve something for the AR

//Placed logo
var imgLogo = Ti.UI.createImageView({
	image: "images/logo-large.png",
	width: "auto",
	height: "auto",
	top: 10
});
win.add(imgLogo);

//This section places an activity indicator inside a view to show and hide based
//on the visible state of the following view.
var viewActInd = Ti.UI.createView({
	width: 100,
	height: 100,
	visible: false
});

var viewActIndBkg = Ti.UI.createView({
	backgroundColor: "#000",
	width: 100,
	height: 100,
	borderRadius: 14,
	opacity: 0.8
});

var actInd = Ti.UI.createActivityIndicator({
	height:50,
	width:10,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
});
//The adds are placed at the bottom to ensure that they are on top of everything in the window.
//This completes the activity indicator section

//Create the  button that will search Facebook places for the locations
var btnNearMe = Ti.UI.createButton({
	title: "what's near me?",
	backgroundImage: "images/btn-bkg-lrg.png",
	width: 274,
	height: 35,
	enabled: false,
	bottom: 115
});

//This simplifies the call to enabled and disable the button for clicking and loading
function EnableDisable(enabled) {
	btnNearMe.enabled = enabled;
}

//Function developed to show the tableview of results for our search.
function FacebookResults(searchTerm, searchLbl) {
	if (facebook.loggedIn) {
		Ti.API.info(win.distance);
		facebook.requestWithGraphPath("search",{q:searchTerm,type:"place",center:center,distance:String(win.distance)},function(e){
			var data = [];
			
			//Ti.API.info(JSON.stringify(e.result));
			
			for (var c=0;c<e.result.data.length;c++) {
				data[c] = {title:e.result.data[c].name, 
							id: e.result.data[c].id,
							name:e.result.data[c].name, 
							lat:e.result.data[c].location.latitude, 
							lng:e.result.data[c].location.longitude,
							street:e.result.data[c].location.street,
							city:e.result.data[c].location.city,
							state:e.result.data[c].location.state,
							zip:e.result.data[c].location.zip
						   };
			}
			
			if (data.length != 0) {				
				var winFbResults = Ti.UI.createWindow({
					url: "winfbresults.js",
					title: searchLbl,
					data: data,
					barColor: "#000",
					currLocation: currLocation,
					navBarHidden: false
				});
				
				Ti.UI.currentTab.open(winFbResults);
			} else {
				alert("No suitable matches were found");
			}
			EnableDisable(true);
			viewActInd.visible = false;
		});
	} else {
		viewActInd.visible = false;
		Ti.API.info("Not Logged In");
		
		var alertDialog = Titanium.UI.createAlertDialog({
    		message: 'You must be logged into Facebook to use this application'
		});
		alertDialog.addEventListener("click", function(e) {
			EnableDisable(true);
		});
		alertDialog.show();
	}
}

//The add event listener here is added at this point to prevent warnings in the console.
btnNearMe.addEventListener("click", function(e) {
	viewActInd.visible = true;
	FacebookResults("*", "What's Near Me");
	EnableDisable(false);
});
win.add(btnNearMe);


//Create the intro lables to direct what a user is supost to do.
var lblDirections = Ti.UI.createLabel({
	text: "loading",
	width: 280,
	height: "auto",
	top: 230,
	textAlign: "center",
	color: "#D7E1E7",
	font: {fontSize: 9, fontFamily: "HelveticaNeue"},
	shadowColor: "#000",
	shadowOffset: {x:0, y:1}
});
win.add(lblDirections);

//This is the Facebook Login Button
var fb = facebook.createLoginButton();
	fb.width = 80;
	fb.height = 20;
	fb.top = 370;
win.add(fb);

//Perform some logic to get our location
//This fires first otherwise we cannot get our search for facebook.
Ti.Geolocation.getCurrentPosition(function(e) {
	center = e.coords.latitude+","+e.coords.longitude;
	currLocation = {lat: e.coords.latitude, lng:e.coords.longitude};
	EnableDisable(true);
	
	Ti.Geolocation.reverseGeocoder(currLocation.lat, currLocation.lng, function(e) {
		var places = e.places[0];
		var address = places.street ? places.street : places.address;
		lblDirections.text = "It's currently "+dateFormat(new Date(), "h:MM tt dddd")+", You are near\n"+places.address;
	});
	
	
});

//This is the activity view adding to the main window
win.add(viewActInd);
viewActInd.add(viewActIndBkg);
viewActInd.add(actInd);
actInd.show();	//we have to call show otherwise the spinner won't show