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
	// displayBasicChartI();
	// displayBasicChartII();
	displaySeriesLineChart();

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
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].onclick = switchTabs;
	}
};

// on click of one of tabs
function switchTabs() {
	"use strict";
	let current = this.parentNode.getAttribute("data-current");

	//remove class of activetabheader and hide old contents
	document.getElementById("tabHeader_" + current).removeAttribute("class");
	document.getElementById("tabPage_" + current).style.display="none";

	let ident = this.id.split("_")[1];

	//add class of activetabheader to new active tab and show contents
	this.setAttribute("class","tabActiveHeader");
	let currentTab = document.getElementById("tabPage_" + ident);
	currentTab.style.display="block";
	let currentTabChildren = currentTab.getElementsByTagName("div");
	for (let i = 0; i < currentTabChildren.length; i++) {
		currentTabChildren.item(i).style.display="block";
	}
	this.parentNode.setAttribute("data-current",ident);
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
		target: 'map-box',
		layers: mapLayers,
		view: mapView,
		controls: mapControls,
	});

	montanaMap.addControl(mousePositionControl);

	console.log('end')
}

function displayBasicChartI() {
	"use strict";
	let data = [4, 8, 15, 16, 23, 42];
	let svg = d3.select(".chart");
	let bar = svg.selectAll("div");
	let barUpdate = bar.data(data);
	let barEnter = barUpdate.enter().append("div");
	barEnter.style("width", function(d) { return d * 5 + "px"; });
	barEnter.text(function(d) { return d; });

}

function displayBasicChartII() {
	"use strict";
	let data = [4, 8, 15, 16, 23, 42];

	let width = 420,
		barHeight = 20;

	let x = d3.scaleLinear()
		.domain([0, d3.max(data)])
		.range([0, width]);

	let chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", barHeight * data.length);

	let bar = chart.selectAll("g")
		.data(data)
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
		.attr("width", x)
		.attr("height", barHeight - 1);

	bar.append("text")
		.attr("x", function(d) { return x(d) - 3; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d; });

}

function displaySeriesLineChart() {
	// "use strict";
	const $ = require("jquery");

	let svg = d3.select("svg");
	let	margin = {top: 20, right: 80, bottom: 30, left: 50};
	let width = $("svg").parent().width() - margin.left - margin.right;
	let height = $("svg").parent().height() - margin.top - margin.bottom;
	// var	width = svg.attr("width") - margin.left - margin.right;
	// var	height = svg.attr("height") - margin.top - margin.bottom;
	var	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y%m%d");

	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.temperature); });

	d3.tsv("tests/resources/data.tsv", type, function(error, data) {
		if (error) throw error;

		var cities = data.columns.slice(1).map(function(id) {
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

		var city = g.selectAll(".city")
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
		for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
		return d;
	}
}
