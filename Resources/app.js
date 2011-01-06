/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/
//app.js
Ti.Geolocation.purpose = "Facebook places for camera overlay";	//Required from 3.2 on

//This is the tab group that will hold our two windows
var tg = Ti.UI.createTabGroup({
	backgroundImage: "images/bkg.png"
});

//This is our main window that will perform most of the actions
var winMain = Ti.UI.createWindow({
	url: "winmain.js",
	navBarHidden: true,
	distance: 1609
});

var winProfile = Ti.UI.createWindow({
	url: "winsettings.js",
	title: "Settings",
	barColor: "#000"
});
winProfile.addEventListener("distance", function(e) {
	winMain.distance = e.distance;
});

//Here are the tabs for the tab group
var tabMain = Ti.UI.createTab({
	title: "Home",
	icon: "images/tab-home.png",
	window: winMain
});

var tabProfile = Ti.UI.createTab({
	title: "Settings",
	icon: "images/tab-settings.png",
	window: winProfile
});

//Add tabs to the group and open the tag group to really start our application
tg.addTab(tabMain);
tg.addTab(tabProfile);
tg.open();