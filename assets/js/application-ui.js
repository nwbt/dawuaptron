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
	const ol = require('openlayers');
	const $ = require("jquery"); // set references to jQuery with the default $
	let montanaCoord = [-110, 47];

	let linesRivers;
	let linesDiversionChannels;
	let pointsWaterUsers;
	let polygonWatershedBasin;
	let pointsStreamflowGauges;

	let width = 0.5;
	let whiteFill = new ol.style.Fill({
		color: 'rgba(255, 255, 255, 0.15)',
	});

	let blueFill = new ol.style.Fill({
		color: 'rgba(0, 0, 255, .75)',
	});

	let redFill = new ol.style.Fill({
		color: 'rgba(255, 0, 0, 0.75)',
	});

	let blackStroke = new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0.25)',
		width: width * 1.5,
	});

	let blueStroke = new ol.style.Stroke({
		color: 'rgba(0, 0, 255, .6)',
		width: width * .6,
	});

	let magentaStroke = new ol.style.Stroke({
		color: 'rgba(255, 0, 255, .35)',
		width: width * 3,
	});

	let defaultCircle1 = new ol.style.Circle({
		radius: width * 5,
		fill: blueFill,
	});

	let defaultCircle2 = new ol.style.Circle({
		radius: width * 5,
		fill: redFill,
	});

	let defaultStyle1 = new ol.style.Style({
		fill: whiteFill,
		stroke: magentaStroke,
		image: defaultCircle1,
	});

	let defaultStyle2 = new ol.style.Style({
		fill: whiteFill,
		stroke: blackStroke,
		image: defaultCircle2,
	});

	let defaultStyle3 = new ol.style.Style({
		fill: whiteFill,
		stroke: blueStroke,
		image: defaultCircle2,
	});

	pointsStreamflowGauges = new ol.source.Vector({
		projection: 'EPSG:4326',
		format: new ol.format.GeoJSON(),
		url: "tests/resources/geojson/MontanaHydroToNodesLatLon.geojson",
	});

	linesRivers = new ol.source.Vector({
		projection: 'EPSG:4326',
		format: new ol.format.GeoJSON(),
		url: "tests/resources/montananetworklatlon.geojson",
	});

	linesDiversionChannels = new ol.source.Vector({
		projection: 'EPSG:4326',
		format: new ol.format.GeoJSON(),
		url: "tests/resources/geojson/DiversionChannelLatLon.geojson",
	});

	pointsWaterUsers = new ol.source.Vector({
		projection: 'EPSG:4326',
		format: new ol.format.GeoJSON(),
		url: "tests/resources/geojson/WaterUserNodeLatLon.geojson",
	});

	polygonWatershedBasin = new ol.source.Vector({
		projection: 'EPSG:4326',
		format: new ol.format.GeoJSON(),
		url: 'tests/resources/geojson/MontanaWatershedBasins.geojson',
	});

	let vPointsStreamflowGauges = new ol.layer.Vector({
		name: 'pointsStreamflowGauges',
		source: pointsStreamflowGauges,
		visible: false,
		zIndex: 95,
		style: defaultStyle2,
	});

	let vLinesRivers = new ol.layer.Vector({
		name: 'linesRivers',
		source: linesRivers,
		visible: false,
		zIndex: 97,
		style: defaultStyle3,
	});

	let vLinesDiversionChannels = new ol.layer.Vector({
		name: 'linesDiversionChannels',
		source: linesDiversionChannels,
		visible: false,
		zIndex: 98,
		style: defaultStyle1,
	});

	let vPointsWaterUsers = new ol.layer.Vector({
		name: 'pointsWaterUsers',
		source: pointsWaterUsers,
		visible: false,
		zIndex: 99,
		style: defaultStyle1,
	});

	let vPolygonWatershedBasin = new ol.layer.Vector({
		name: 'polygonWatershedBasin',
		source: polygonWatershedBasin,
		visible: false,
		zIndex: 96,
		style: defaultStyle2,
	});

	let tStamenTerrian = new ol.layer.Tile({
		name: 'stamenTerrain',
		source: new ol.source.Stamen({
			layer: 'terrain-background'
		}),
		visible: false,
		zIndex: 0,
	});

	let tOpenStreetMaps = new ol.layer.Tile({
		name: 'openStreetMaps',
		source: new ol.source.OSM(),
		visible: false,
		zIndex: 1,
	});

	let tMapbox = new ol.layer.Tile({
		name: 'mapbox',
		source: new ol.source.XYZ({
			url: 'https://api.mapbox.com/styles/v1/nwbt/ciyyunuuq002b2rmk2d8rz8g8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibndidCIsImEiOiJjaXl5dWIxMTIwMDd6MndweHg1Zm4wd3hsIn0.8pZd_crQIcSDsq-GlEpYjA',
		}),
		visible: false,
		zIndex: 2,
	});

	// todo dynamically add checkboxes here & remove from html
	// let checkboxes = $('#maplayer-controls')

	let mapLayers = [tStamenTerrian, tOpenStreetMaps, tMapbox, vPointsStreamflowGauges, vLinesRivers, vLinesDiversionChannels, vPointsWaterUsers, vPolygonWatershedBasin];

	let mapView = new ol.View({
		projection: 'EPSG:4326',
		center: montanaCoord,
		zoom: 7
	});

	let mousePositionControl = new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(2),
		projection: 'EPSG:4326'
	});

	let mapControls = ol.control.defaults({
		attribution: false,
	}).extend([
		mousePositionControl,
	]);

	let montanaMap = new ol.Map({
		target: 'map',
		layers: mapLayers,
		view: mapView,
		controls: mapControls,
	});

	$('#maplayer-controls').on('change', function(event) {
		let target = $(event.target);
		let control = target.val();

		if(target.prop('checked')) {
			let layers = montanaMap.getLayers().getArray();
			for(let i = 0; i < layers.length; i++) {
				if (control === layers[i].get('name')) {
					layers[i].setVisible(true);
				}
			}
		} else {
			let layers = montanaMap.getLayers().getArray();
			for(let i = 0; i < layers.length; i++) {
				if (control === layers[i].get('name')) {
					layers[i].setVisible(false);
				}
			}
		}
	});
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
