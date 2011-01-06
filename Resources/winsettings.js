/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/
var win = Ti.UI.currentWindow;

var lblHeading = Ti.UI.createLabel({
	text: "Adjust the distance that Facebook searches",
	width: 280,
	height: "auto",
	left: 20,
	color: "#fff",
	font: {fontFamily: "HelveticaNeue-Bold", fontSize: 	9},
	top: 30
});
win.add(lblHeading);

var buttonObjects = [
	{title: '1 mi.', distance:1609},
	{title: '2 mi.', distance:3218},
	{title: '5 mi.', distance: 8045}
];
var bb = Ti.UI.createButtonBar({
	labels:buttonObjects,
	style:2,
	backgroundColor:'#000',
	top:45,
	height:40,
	width:280,
	backgroundImage: 'none'
});

win.add(bb);

bb.addEventListener('click', function(e) {
	var distance = buttonObjects[e.index].distance;
	lblSelected.text = "You selected: "+ buttonObjects[e.index].title;
	win.fireEvent("distance", {distance:distance});
});

var lblSelected = Ti.UI.createLabel({
	text: "",
	width: 280,
	height: "auto",
	left: 20,
	color: "#fff",
	font: {fontFamily: "HelveticaNeue-Bold", fontSize: 	9},
	top: 90
});
win.add(lblSelected);

var imgLogo = Ti.UI.createImageView({
	image: "images/threesphere.png",
	width: "auto",
	height: "auto",
	bottom: 140
});
win.add(imgLogo);

var lblTNA = Ti.UI.createLabel({
	text: "thenativeadvantage.com",
	width: 300,
	height: "auto",
	bottom: 100,
	font: {fontFamily: "HelveticaNeue-Bold", fontSize: 	10},
	textAlign: "center",
	color: "#fff"
});
win.add(lblTNA);

var lblLegal = Ti.UI.createLabel({
	text: "Appcelerator Titanium Platform\n Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.\n Licensed under the terms of the Apache Public License\n Please see the LICENSE included with this distribution for details.",
	width: 280,
	height: "auto",
	bottom: 10,
	left: 20,
	font: {fontFamily: "HelveticaNeue", fontSize: 9},
	textAlign: "left",
	color: "#fff"
});
win.add(lblLegal);