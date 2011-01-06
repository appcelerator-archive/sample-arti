/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

/*
The basics of this file pulls the data from FB places through an XHR. There is really nothing here that
should be unique to your development process. It is here more for reference and fun
*/
var win = Ti.UI.currentWindow;

var xhrDetail = Ti.Network.createHTTPClient();
	xhrDetail.validatesSecureCertificate = true;	//This is defaulted to true on device so set it to true for simulation

//Successful call
xhrDetail.onload = function() {
	var data = JSON.parse(this.responseText);
	//Ti.API.info(data);
	
	var lblName = Ti.UI.createLabel({
		text: data.name,
		width: 300,
		height: 32,
		left: 20,
		top: 15,
		font: {fontFamily: "HelveticaNeue-Bold", fontSize: 30},
		color: "#fff",
		shadowColor: "#000",
		shadowOffset: {x:0, y:2}
	});
	win.add(lblName);
	
	var lblLocal = Ti.UI.createLabel({
		text: data.category,
		width: 300,
		height: "auto",
		left: 20,
		top: 45,
		font: {fontFamily: "HelveticaNeue-Bold", fontSize: 16},
		color: "#fff",
		shadowColor: "#000",
		shadowOffset: {x:0, y:2},
		opacity: 0.8
	});
	win.add(lblLocal);
	
	if (data.location.street) {
		var lblLocal = Ti.UI.createLabel({
			text: data.location.street,
			width: 300,
			height: "auto",
			left: 20,
			top: 85,
			font: {fontFamily: "HelveticaNeue-Bold", fontSize: 12},
			shadowColor: "#fff",
			shadowOffset: {x:0, y:1},
			color: "#000"
		});
		win.add(lblLocal);
	}
	
		var cityStateZip = "";
	if (data.location.city != null) {
		cityStateZip += data.location.city;
	}
	
	if (data.location.state != null) {
		cityStateZip += ", "+data.location.state;
	}
	
	if (data.location.zip != null) {
		cityStateZip += " "+data.location.zip;
	}
	
	var lblAddy = Ti.UI.createLabel({
		text: cityStateZip,
		color: "#000",
		textAlign: "left",
		width: 200,
		top: 100,
		left: 20,
		font: {fontSize: 12, fontFamily:"HelveticaNeue-Bold"},
		shadowColor: "#fff",
		shadowOffset: {x:0, y:1},
		height: 12
	});
	win.add(lblAddy);
	
	if (data.phone) {
		var btnPhone = Ti.UI.createButton({
			title: data.phone,
			backgroundImage: "images/btn-bkg-lrg.png",
			width: 274,
			height: 35,
			top: 135
		});
		
		btnPhone.addEventListener('click', function(e) {
		    Ti.Platform.openURL('tel:'+data.phone);
		});
		
		win.add(btnPhone);
	}
	
	var viewSeperator = Ti.UI.createView({
		backgroundColor: "#fff",
		width: 4,
		top: 200,
		height: 130,
		opacity: 0.6
	});
	win.add(viewSeperator);
	
	var lblLikes = Ti.UI.createLabel({
			text: "Likes",
			width: 160,
			height: "auto",
			left: 0,
			top: 210,
			font: {fontFamily: "HelveticaNeue-Bold", fontSize: 14},
			shadowColor: "#000",
			shadowOffset: {x:0, y:1},
			color: "#fff",
			textAlign: "center"
		});
		win.add(lblLikes);
	
	var lblCheckins = Ti.UI.createLabel({
			text: "Checkins",
			width: 160,
			height: "auto",
			right: 0,
			top: 210,
			font: {fontFamily: "HelveticaNeue-Bold", fontSize: 14},
			shadowColor: "#000",
			shadowOffset: {x:0, y:1},
			color: "#fff",
			textAlign: "center"
		});
		win.add(lblCheckins);
		
		
		var lblLikesData = Ti.UI.createLabel({
			text: (data.likes) ? data.likes : "n/a",
			width: 160,
			height: "auto",
			left: 0,
			top: 240,
			font: {fontFamily: "HelveticaNeue-Bold", fontSize: 36},
			shadowColor: "#000",
			shadowOffset: {x:0, y:1},
			color: "#fff",
			textAlign: "center"
		});
		win.add(lblLikesData);
	
	var lblCheckinsData = Ti.UI.createLabel({
			text: (data.checkins) ? data.checkins : "n/a",
			width: 160,
			height: "auto",
			right: 0,
			top: 240,
			font: {fontFamily: "HelveticaNeue-Bold", fontSize: 36},
			shadowColor: "#000",
			shadowOffset: {x:0, y:1},
			color: "#fff",
			textAlign: "center"
		});
		win.add(lblCheckinsData);
	
};

//Error Results
xhrDetail.onerror = function(e)
{
	Ti.API.info('Error '+e.error);
};
//GET or POST plus the URL
xhrDetail.open("GET","https://graph.facebook.com/"+win.id);
xhrDetail.send();