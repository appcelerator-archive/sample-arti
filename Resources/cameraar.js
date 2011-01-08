/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

/*
This is added here to help with the calculations.
Functions include the following in math.js
ToRad(deg)
ToDeg(rad)
Distance(point1, point2)
Bearing(point1, point2)
ComputeXDelta(relAngle)
*/
Ti.include("math.js");

/*
We add the simulator here to set the window properly. This is done
throughout this file to maintain seperation from device and emulator,
most items can be testing in the simulator prior to device to help
speed up development.
*/
var win = Ti.UI.currentWindow;
var locations = win.data;				//This is the JSON array of the locations that are used in in the tableview.
var currLocation = win.currLocation;		//We pass the current location here to give us a starting point.
var currBearing = 0; 					//Current bearing of the device.
var ok = false;				//This variable will dictate the setInterval based on if the heading is firing.
var viewAngleX = ToRad(15);			//This is an estimation of the total viewing angle that you see.
var locViews = [];					//All of the locations are stored in views. The views are stored into this array
var maxDist = 0;					//The maxDist is used to layout all of the radar points properly
var displayCaps = Ti.Platform.displayCaps;	//This is for the width & height of the device the other two variables get the center
var centerX = displayCaps.platformWidth/2;	
var centerY = displayCaps.platformHeight/2;	

//This creates the overlay for the camera
var overlayView = Ti.UI.createView();

/*
This is for the header of the view. It contains an image,
close button, & a center image to the bar.
*/
var viewTitle = Ti.UI.createView({
	width: 320,
	height: 41,
	backgroundImage: "images/header-ar.png",
	top: 0
});

var btnClose = Titanium.UI.createButton({
	backgroundImage: "images/btn-close.png",
	width: 59,
	height: 28,
	left: 10,
	font: {fontSize: 12, fontFamily: "HelveticaNeue-Bold"},
	title: "Close"
});

btnClose.addEventListener('click', function() { 
	//This simulation component either closes the modal view or removes the camera. Nothing complex here.
	if (Ti.Platform.model == "Simulator") {
		win.close(); 
	} else {
		Ti.Media.hideCamera();
		win.close();
	}
});

var imgLogo = Ti.UI.createButton({
	backgroundImage: "images/logo-small.png",
	width: 50,
	height: 41,
	touchEnabled: false
});

viewTitle.add(btnClose);
viewTitle.add(imgLogo);
overlayView.add(viewTitle);
//End of the header items


/*
This initial loop creates the views that we see in the camera.
It contains some simple logic to show only items that are not null. Since 
not all of the items have addresses, we do not show some of those.
*/
for (var i = 0; i < locations.length; i++) {
	/*
	Based on the distance we set the opacity & scale of the entire location.
	This is done based on the distance of the items in an if then statement.
	*/
	var dist 	= Distance(currLocation, locations[i]);
	var opacity = ((1/dist) > 0.8) ? 0.8 : (1/dist).toFixed(2);
	var scale 	= ((1/dist) > 0.9 ) ? 0.75 : (1/dist).toFixed(2);	//Scale is set here, smaller based on distance.
	var tmatrix = Ti.UI.create2DMatrix().scale(scale);				//We set the scale here to avoid "flashes" when rotating
	var horizAngle = Bearing(currLocation, locations[i]);		
	
	//This little section here will help with the poltting of our radar view.
	//We need to establish the max distance for the plotting to work properly.
	if (dist > maxDist) {
		maxDist = dist;
	}
	
	var viewPlace = Ti.UI.createView({
		height: 60,
		width: 229,
		x: 0,
		name: locations[i].name,
		loc: {lat:locations[i].lat, lng:locations[i].lng},
		opacity: opacity,
		scale: scale,
		top: 150,
		transform: tmatrix
	});
	
	
	var bkgLocView = Ti.UI.createButton({
		height: 60,
		width: 229,
		backgroundImage: "images/bkg-ar.png",
		id:locations[i].id
	});
	
	bkgLocView.addEventListener("click", function(e) {
		if (Ti.Platform.model == "Simulator") {
			win.close(); 
			win.fireEvent("winDetail", {id:e.source.id});
		} else {
			Ti.Media.hideCamera();
			win.close();			
			win.fireEvent("winDetail", {id:e.source.id});
		}
	});
	viewPlace.add(bkgLocView);
	
	var msgNameLbl = Ti.UI.createLabel({
		text: locations[i].name,
		color: "#000",
		textAlign: "left",
		width: 185,
		top: 5,
		left: 5,
		font: {fontSize: 12, fontFamily:"HelveticaNeue-Bold"},
		height: 20
	});
	
	if (locations[i].street != null) {
		var msgLocLbl1 = Ti.UI.createLabel({
			text: locations[i].street,
			color: "#808285",
			textAlign: "left",
			width: 185,
			top: 25,
			left: 5,
			font: {fontSize: 11, fontFamily:"HelveticaNeue"},
			height: 12
		});
		viewPlace.add(msgLocLbl1);
	}
	
	var cityStateZip = "";
	if (locations[i].city != null) {
		cityStateZip += locations[i].city;
	}
	
	if (locations[i].state != null) {
		cityStateZip += ", "+locations[i].state;
	}
	
	if (locations[i].zip != null) {
		cityStateZip += " "+locations[i].zip;
	}
	
	var msgLocLbl2 = Ti.UI.createLabel({
		text: cityStateZip,
		color: "#808285",
		textAlign: "left",
		width: 185,
		top: 35,
		left: 5,
		font: {fontSize: 11, fontFamily:"HelveticaNeue"},
		height: 12
	});
	
	viewPlace.add(msgNameLbl);
	viewPlace.add(msgLocLbl2);
	
	viewPlace.hide();	
	overlayView.add(viewPlace);
	locViews.push(viewPlace);
};

/*
The following views and buttons are set here for the "radar" view
that is in the top right corner of the screen the circleView
holds all of the points that then get rotated based on the heading
*/
var targetView = Ti.UI.createView({
	height: 103,
	width: 98,
	top: 40,
	right: 0
});

var targetImg = Ti.UI.createButton({
	backgroundImage: "images/target.png",
	height: 103,
	width: 99,
	opacity: 0.8,
	touchEnabled: false
});

var circleView = Ti.UI.createView({
	height: 60,
	width: 60,
	borderRadius: 30,
	top: 66,
	right: 19,
	opacity: 0.5
});
targetView.add(targetImg);
overlayView.add(targetView);
overlayView.add(circleView);

/*
This function adds all of the radar points onto the screen in their appropriate
positions. Earlier we calculated the maxDist so that these will plot properly.
This gets run only once when the AR view is opened.
*/
function MapLocations() {	
	for (var i = 0; i < locations.length; i++) {
		var dist = Distance(currLocation, locations[i]);
		var horizAngle = Bearing(currLocation, locations[i]);
		
		var ro = 28 * dist / maxDist;
		var centerX = 28 + ro * Math.sin(horizAngle);
		var centerY = 28 - ro * Math.cos(horizAngle);

		var circView = Ti.UI.createView({
			height: 4,
			width: 4,
			backgroundColor: "#fff",
			borderRadius: 2,
			top: centerY - 2,
			left: centerX - 2
		});
		circleView.add(circView);
	}
};

/*
UpdateView controls what views are currently on the screen and what is hidden.
From there it runs an additional function to dictate order on screen, and movement
from right to left and left to right.
*/
function UpdateView() {
	var onScreen = [];	//This array will hold the views that are actively on the viewable area of the screen
	
	for (var i = 0; i < locations.length; i++) {
		var horizAngle = Bearing(currLocation, locations[i]);
		var dist = Distance(currLocation, locations[i]);
		var relAngleH = horizAngle - currBearing;
		
		//This handy code cuts out a lot of overprocessing
		if (ToDeg(relAngleH) >= 90 && ToDeg(relAngleH) <= 270) {
			continue;
		}
		
		var xDelta = ComputeXDelta(relAngleH);
		var viewCenterX = xDelta * centerX + centerX;
		locViews[i].x = viewCenterX - 130;
		
		//This checks the right and left of the screen to see if the view is visible.
        if (locViews[i].x > displayCaps.platformWidth + 130 || (locViews[i].x + 130) < -229) {
            locViews[i].hide();
        } else {
			onScreen.push(locViews[i]);
            locViews[i].show();
        }
	}
	
	//This does all the hard work :) Pay attention here!
	/*
	All elements on screen now get a revised matrix for placement. They also
	get rerun through the various math functions. This is seperated out
	to give order to the items on screen. Otherise we would have a ton of overlay.
	I'm sure there is room for improvement here, but this is a great start.
	*/
	for (var j= 0; j < onScreen.length; j++) {			
		var totalDeep 		= 1;	//This variable determines how var to layer the items on the screen	
		var horizAngle1 	= Bearing(currLocation, onScreen[j].loc);
		var relAngleH1 		= horizAngle1 - currBearing;
		var xDelta1 		= ComputeXDelta(relAngleH1);
		var viewCenterX1	= xDelta1 * centerX + centerX;	//This is related to the global centerX & Y
		
		var t = Ti.UI.create2DMatrix().scale(onScreen[j].scale); //Grab the scale variable that we stored earlier
			t.tx = viewCenterX1 - 130;	//This sets our left and right movements
		
		onScreen[j].x = viewCenterX1;	//This helps with the comparison in the following conditionals
				
		for (var k=0; k < onScreen.length; k++) {
			if (viewCenterX1 == onScreen[k].x) {
				break;
			} else {
				/*
				This loop with the conditional looks for overlap on the location views. If it overlays, it adds 55px to the 
				overlaped one and pushes it down. Improvement here could be to cap the limit, tie this in with 
				the accelerometer, and also reset it. This is an area for performance improvements, but
				gives a simple example of what can be done for quick sorting.
				*/
				if ((onScreen[k].x < onScreen[j].x + 229) || (onScreen[k].x > onScreen[j].x - 229)) {	
						var ty = 55 * totalDeep;
							t.ty = ty;
						totalDeep++;
					} else {
						t.ty = 0;
						totalDeep--;
					}
	
				}				
		}
		//We perform the transformation after all of that!
		onScreen[j].transform = t;
	}
};



/*
Create all the radar blips on the screen
*/
MapLocations();

if (Ti.Platform.model == "Simulator") {
	//Add a slider if we are in the simulator
	var slider = Ti.UI.createSlider({
		min: 0,
		max: 10,
		value: 0,
		width: 300,
		bottom: 20
	});
	
	slider.addEventListener("change", function(e) {
		currBearing = ToRad(e.value * 36);
		UpdateView();	
		circleView.transform = Ti.UI.create2DMatrix().rotate(ToDeg(-currBearing));
	});
		
	overlayView.add(slider);
	win.add(overlayView);
	
} else {
	//Create the heading event to monitor the direction we are facing
	Ti.Geolocation.addEventListener("heading", function(e) {
		currBearing = ToRad(e.heading.magneticHeading);
		ok = true;
	});
	
	//This is the update for moving all of the elements on the screen and rotating the radar screen	
	setInterval(function() {
		if (!ok) {
			return;
		} 
		UpdateView();
		circleView.transform = Ti.UI.create2DMatrix().rotate(ToDeg(-currBearing));
	}, 50);
	
		
	 //This is the last part of the puzzle, launch the camera and add the overlayView!
	 Ti.Media.showCamera({
	    success:function(event) {},
	    cancel:function() {},
	    error:function(error) {
	        var a = Titanium.UI.createAlertDialog({title:'Camera'});
	        if (error.code == Titanium.Media.NO_CAMERA) {
	            a.setMessage('Please run this test on device');
	        } else {
	            a.setMessage('Unexpected error: ' + error.code);
	        }
	        a.show();
	    },
	    overlay:overlayView,
	    showControls:false,	// don't show system control
	    autohide:false 	// tell the system not to auto-hide and we'll do it ourself
	});
}