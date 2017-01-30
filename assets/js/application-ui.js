/*
 * custom-map.js
 * Copyright (C) 2017  <@ruby.local>
 *
 * Distributed under terms of the MIT license.
 */
(function(){
    'use strict';
    console.log('beginning')
    var montanaCoord = [-110, 47];

    var mapSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: "tests/resources/montananetworklatlon.geojson"
    });

    var vectorLayer = new ol.layer.Vector({
        source: mapSource
    });

    var rasterLayer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'terrain-background'
        })
    });

    var mapLayers = [rasterLayer, vectorLayer];

    var mapView = new ol.View({
        projection: 'EPSG:4326',
        center: montanaCoord,
        zoom: 7
    });

    var mapControls = ol.control.defaults().extend([
      new ol.control.FullScreen()
    ])

    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(2),
        projection: 'EPSG:4326'
    });

    var montanaMap = new ol.Map({
        target: 'map-box',
        layers: mapLayers,
        view: mapView,
        controls: mapControls,
    });

    montanaMap.addControl(mousePositionControl);

    console.log('end')
})();

window.onload=function() {
	"use strict";

	// get tab container
	let container = document.getElementById("tabContainer");
	let tabcon = document.getElementById("tabsContent");

	// set current tab
	let navitem = document.getElementById("tabHeader_1");

	// store which tab we are on
	let ident = navitem.id.split("_")[1];

	// alert(ident)
	navitem.parentNode.setAttribute("data-current", ident);

	// set current tab with class of activeTabHeader
	navitem.setAttribute("class", "tabActiveHeader");

	//hide two tab contents we don't need
	let pages = tabcon.getElementsByTagName("div");
	for (let i = 1; i < pages.length; i++) {
		pages.item(i).style.display = "none";
	}

	//this adds click event to tabs
	let tabs = container.getElementsByTagName("li");
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].onclick = displayPage;
	}
}

// on click of one of tabs
function displayPage() {
	"use strict";
	let current = this.parentNode.getAttribute("data-current");

	//remove class of activetabheader and hide old contents
	document.getElementById("tabHeader_" + current).removeAttribute("class");
	document.getElementById("tabPage_" + current).style.display="none";

	let ident = this.id.split("_")[1];

	//add class of activetabheader to new active tab and show contents
	this.setAttribute("class","tabActiveHeader");
	document.getElementById("tabPage_" + ident).style.display="block";
	this.parentNode.setAttribute("data-current",ident);

};
