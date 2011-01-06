/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/
var win = Ti.UI.currentWindow;
var data = win.data;

Ti.include("math.js");

var btnAr = Ti.UI.createImageView({
	image: "images/ar.png",
	width: "auto",
	height: "auto"
});
btnAr.addEventListener("click", function(e) {
	var winAr = Ti.UI.createWindow({
		url: "cameraar.js",
		backgroundColor: "#000",
		backgroundImage: "images/sim-bkg.png",
		data: win.data,
		navBarHidden: true,
		currLocation: win.currLocation
	});	
	winAr.open();
	winAr.addEventListener("winDetail", function(e) {
		var winDetail = Ti.UI.createWindow({
			url: "windetail.js",
			barColor: "#000",
			backButtonTitle: "Back",
			title: "Details",
			id: e.id
		});
	
	Ti.API.info(e.id);
	
	Ti.UI.currentTab.open(winDetail);

	});
});
win.rightNavButton = btnAr;


var tv = Ti.UI.createTableView({
	backgroundColor: "transparent"
});

for (var i=0; i < data.length; i++) {
	var row = Ti.UI.createTableViewRow({
		name: data[i].name,
		data: data[i],
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height: 50
	});
	
	var viewBkg = Ti.UI.createView({
		width: "100%",
		height: "100%",
		backgroundColor: "#fff",
		opacity: 0.7
	});
	
	var lblTitle = Ti.UI.createLabel({
		text: data[i].name,
		left: 7,
		top: 5,
		width: 280,
		height: 20,
		color: "#000",
		font: {fontSize: 16, fontFamily: "HelveticaNeue-Bold"}
	});
	
	var street = (data[i].street == null) ? "" : data[i].street;
	var city = (data[i].city == null) ? "" : data[i].city;
	var state = (data[i].state == null) ? "" : data[i].state;
	var zip = (data[i].zip == null) ? "" : data[i].zip;
	
	var spacer = " ";
	if ((city != "") && (state != "")) {
		spacer = ", ";
	}
	
	var lblAddress = Ti.UI.createLabel({
		text: street+"\n"+city+spacer+state+" "+zip,
		left: 7,
		bottom: 2,
		width: 280,
		height: 26,
		color: "#58595B",
		font: {fontSize: 9, fontFamily: "HelveticaNeue"}
	});
	
	var dist = Distance(win.currLocation, data[i]);
	
	var lblDist = Ti.UI.createLabel({
		text: dist.toFixed(2)+" mi.",
		width: 100,
		height: 18,
		right: 40,
		textAlign: "right",
		font: {fontSize: 9, fontFamily:"HelveticaNeue-Bold"},
		bottom: 0
	});
	
	var imgHasChild = Ti.UI.createImageView({
		image: "images/table-haschild.png",
		width: "auto",
		height: "auto",
		top: 0,
		right:2,
		opacity: 0.7
	});
	
	
	row.add(viewBkg);
	row.add(lblTitle);
	row.add(lblAddress);
	row.add(lblDist);
	row.add(imgHasChild);
	tv.appendRow(row);
}


tv.addEventListener("click", function(e) {
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	
	var winDetail = Ti.UI.createWindow({
		url: "windetail.js",
		barColor: "#000",
		backButtonTitle: "Back",
		title: "Details",
		id: e.rowData.data.id
	});
	
	Ti.API.info(e.rowData.data.id);
	
	Ti.UI.currentTab.open(winDetail);
});

win.add(tv);

