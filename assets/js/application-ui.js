/**
 * File: application-ui.js Project: webstorm-empty
 *
 * Copyright (c) 2017 Dan Catalano <dev@nwbt.co>
 *
 * Distributed under terms of the MIT license.
 */

window.onload=function() {
	"use strict";

	displayMap();

	displaySeriesLineChart();

	setPrimaryTab();
	setSidebarTab();
};

function setPrimaryTab() {
	"use strict";
	let container = document.getElementById("primary-tab-container");
	let tabContents = document.getElementById("primary-tab-contents");

	let activeHeader = document.getElementById("primary-tab-header_1");
	let activeTabNumber = activeHeader.id.split("_")[1];

	activeHeader.parentNode.setAttribute("primary-data-current", activeTabNumber);
	activeHeader.setAttribute("class", "tab-active-header");

	let pages = tabContents.getElementsByClassName("primary-tab-page");
	for (let i = 1; i < pages.length; i++) {
		pages.item(i).style.display = "none"
	}

	let tabs = container.getElementsByTagName("li");
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].onclick = switchPrimaryTabs;
	}
}

function switchPrimaryTabs() {
	"use strict";
	let current = this.parentNode.getAttribute("primary-data-current");
	document.getElementById("primary-tab-header_" + current).removeAttribute("class");
	document.getElementById("primary-tab-page_" + current).style.display="none";

	let activeTabNumber = this.id.split("_")[1];

	this.setAttribute("class", "tab-active-header");
	let currentTab = document.getElementById("primary-tab-page_" + activeTabNumber);
	currentTab.style.display="block";

	// todo this block may be unnecessary and problematic because it interferes with display: flex
	// let currentTabChildren = currentTab.getElementsByTagName("div");
	// for (let i = 0; i < currentTabChildren.length; i++) {
	// 	currentTabChildren.item(i).style.display="block";
	// }
	this.parentNode.setAttribute("primary-data-current", activeTabNumber);
}

// todo redundant code block, merge with primary
function setSidebarTab() {
	"use strict";
	let container = document.getElementById("sidebar-tab-container");
	let tabContents = document.getElementById("sidebar-tab-contents");

	let activeHeader = document.getElementById("sidebar-tab-header_1");
	let activeTabNumber = activeHeader.id.split("_")[1];

	activeHeader.parentNode.setAttribute("sidebar-data-current", activeTabNumber);
	activeHeader.setAttribute("class", "tab-active-header");

	let pages = tabContents.getElementsByClassName("sidebar-tab-page");
	for (let i = 1; i < pages.length; i++) {
		pages.item(i).style.display = "none"
	}

	let tabs = container.getElementsByTagName("li");
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].onclick = switchSidebarTabs;
	}
}

// todo redundant code block, merge with primary
function switchSidebarTabs() {
	"use strict";
	let current = this.parentNode.getAttribute("sidebar-data-current");
	document.getElementById("sidebar-tab-header_" + current).removeAttribute("class");
	document.getElementById("sidebar-tab-page_" + current).style.display="none";

	let activeTabNumber = this.id.split("_")[1];

	this.setAttribute("class", "tab-active-header");
	let currentTab = document.getElementById("sidebar-tab-page_" + activeTabNumber);
	currentTab.style.display="block";

	// todo this block may be unnecessary and problematic because it interferes with display: flex
	// let currentTabChildren = currentTab.getElementsByTagName("div");
	// for (let i = 0; i < currentTabChildren.length; i++) {
	// 	currentTabChildren.item(i).style.display="block";
	// }
	this.parentNode.setAttribute("sidebar-data-current", activeTabNumber);
}

function displayMap(){
	'use strict';
	console.log('beginning')
	let montanaCoord = [-110, 47];

	let mapSource = new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: "tests/resources/montananetworklatlon.geojson"
	});

	let vectorLayer = new ol.layer.Vector({
		source: mapSource
	});

	let rasterLayer = new ol.layer.Tile({
		source: new ol.source.Stamen({
			layer: 'terrain-background'
		})
	});

	let mapLayers = [rasterLayer, vectorLayer];

	let mapView = new ol.View({
		projection: 'EPSG:4326',
		center: montanaCoord,
		zoom: 7
	});

	let mapControls = ol.control.defaults().extend([
		new ol.control.FullScreen()
	]);

	let mousePositionControl = new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(2),
		projection: 'EPSG:4326'
	});

	let montanaMap = new ol.Map({
		target: 'map',
		layers: mapLayers,
		view: mapView,
		controls: mapControls,
	});

	montanaMap.addControl(mousePositionControl);

	console.log('end')
}

// todo clean up - var to let
function displaySeriesLineChart() {
	"use strict";
	const $ = require("jquery"); // set references to jQuery with the default $
	// let d3 = require("d3");
	let svg = d3.select("svg#chart"); // get a hold of the svg element

	let	margin = {
		top: 20,
		right: 80,
		bottom: 30,
		left: 50
	}; // defining the chart/graph's margins

	// not sure why but the below id's parent's height is correct and it's own is but a fraction of the avail space
	let parentObj = $('#primary-tab-page_2').parent(); // get reference to parent object of #primary-tab-page_2 which holds the dimensions of container/box
	let origWidth = parentObj.width(); // get width of parent box
	let origHeight = parentObj.height(); // get height of parent box

    let width =  origWidth - margin.left - margin.right; // calculate the total width
    let height =  origHeight - margin.top - margin.bottom; // calculate the total height

	let	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	let parseTime = d3.timeParse("%Y%m%d");

	let x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	let line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.temperature); });

	d3.tsv("tests/resources/data.tsv", type, function(error, data) {
		if (error) throw error;

		let cities = data.columns.slice(1).map(function(id) {
			return {
				id: id,
				values: data.map(function(d) {
					return {date: d.date, temperature: d[id]};
				})
			};
		});

		x.domain(d3.extent(data, function(d) { return d.date; }));

		y.domain([
			d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
			d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
		]);

		z.domain(cities.map(function(c) { return c.id; }));

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("fill", "#000")
			.text("Temperature, ºF");

		let city = g.selectAll(".city")
			.data(cities)
			.enter().append("g")
			.attr("class", "city");

		city.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return z(d.id); });

		city.append("text")
			.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
			.attr("x", 3)
			.attr("dy", "0.35em")
			.style("font", "10px sans-serif")
			.text(function(d) { return d.id; });
	});

	function type(d, _, columns) {
		d.date = parseTime(d.date);
		for (let i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
		return d;
	}
}
