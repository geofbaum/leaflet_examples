		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		var endDate = new Date(currentTime.getTime());
		L.TimeDimension.Util.addTimeDuration(endDate, "P2D", true);
	
		var map = L.map('map', {
			center: [45.25, -73.6159],
			zoom: 9,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				//times: "PT8H/"+"P2D/"+"PT1H"
				timeInterval: currentTime.toISOString() + "/P2D",
				period: "PT1H",
				currentTime: currentTime.getTime(),
			},
			timeDimensionControlOptions: {
				styleNS: "leaflet-control-timecontrol",
				position: "bottomleft",
				autoPlay: false,
				loopButton: true,
				//playReverseButton: true,
				playerOptions: {
					buffer: 10,
					transitionTime: 250,
					//loop: true,
				},
			},
			
		});
		
		var basemaps = {
			Google: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}')
		}; 

		
		var temperatureLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'HRDPS.CONTINENTAL_TT',
			opacity: '0.5',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});

		var windLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'HRDPS.CONTINENTAL_UU',
			opacity: '0.5',
			transparent: true,
			format: 'image/png',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});
			
		var precipLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'HRDPS.CONTINENTAL_PR',
			opacity: '0.8',
			transparent: true,
			format: 'image/png'
			});
			
		var dewpointLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'HRDPS.CONTINENTAL_ES',
			opacity: '0.75',
			transparent: true,
			format: 'image/png'
			});
			
		var radarLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'RADAR_RDBS',
			transparent: true,
			format: 'image/png'
			});

	    var proxy = 'proxy.php';
			
		var tdTemp = L.timeDimension.layer.wms(temperatureLayer, {
			wmsVersion: "1.1.1",
			proxy: proxy,
		});
		
		var tdDew = L.timeDimension.layer.wms(dewpointLayer, {
			wmsVersion: "1.1.1",
			proxy: proxy,
		});
		
		var tdWind = L.timeDimension.layer.wms(windLayer, {
			wmsVersion: "1.1.1",
			proxy: proxy,
		});
		
		var tdPrecip = L.timeDimension.layer.wms(precipLayer, {
			wmsVersion: "1.1.1",
			proxy: proxy,
		});
		
		// add Temp Legend
		var legend1 = L.control({position: 'bottomright'});
		legend1.onAdd = function(map) {
			var src1 = "http://geo.weather.gc.ca/geomet//?LANG=E%26SERVICE=WMS%26VERSION=1.1.1%26REQUEST=GetLegendGraphic%26STYLE=TEMPERATURE%26LAYER=HRDPS.CONTINENTAL_TT%26format=image/png"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src1 + '" alt="legend">';
			return div;
		};
		
		
		// add Wind Legend
		var legend2 = L.control({position: 'bottomright'});
		legend2.onAdd = function(map) {
			var src2 = "http://geo.weather.gc.ca/geomet//?LANG=E%26SERVICE=WMS%26VERSION=1.1.1%26REQUEST=GetLegendGraphic%26STYLE=WINDARROWKMH%26LAYER=HRDPS.CONTINENTAL_UU%26format=image/png"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src2 + '" alt="legend">';
			return div;
		};
		
		// add dewpoint Legend
		var legend3 = L.control({position: 'bottomright'});
		legend3.onAdd = function(map) {
			var src3 = "http://geo.weather.gc.ca/geomet//?LANG=E%26SERVICE=WMS%26VERSION=1.1.1%26REQUEST=GetLegendGraphic%26STYLE=DEWPOINTDEP%26LAYER=HRDPS.CONTINENTAL_ES%26format=image/png"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src3 + '" alt="legend">';
			return div;
		};
		
		// add Precip Legend
		var legend4 = L.control({position: 'bottomright'});
		legend4.onAdd = function(map) {
			var src4 = "http://geo.weather.gc.ca/geomet//?LANG=E%26SERVICE=WMS%26VERSION=1.1.1%26REQUEST=GetLegendGraphic%26STYLE=PRECIPMM%26LAYER=HRDPS.CONTINENTAL_PR%26format=image/png"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src4 + '" alt="legend">';
			return div;
		};
		
		legend1.addTo(map);
		
		var envcan = {
			'Temperature': tdTemp,
			'Dewpoint': tdDew,
			'Windspeed Arrows in km/h': tdWind,
			'Cumulative Precipitation (mm)': tdPrecip,
		};
			
		L.control.layers(basemaps, envcan).addTo(map);
		
		envcan.Temperature.addTo(map);
		basemaps.Google.addTo(map);

		// Remove Legends
		map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'Temperature') {
				this.removeControl(legend1);
			} else if (eventLayer.name === 'Dewpoint') {
				this.removeControl(legend3);
			} else if (eventLayer.name === 'Windspeed Arrows in km/h') {
				this.removeControl(legend2);
			} else {
				this.removeControl(legend4);
			}
		});
		map.on('overlayadd', function (eventLayer) {
		// Add Legends
			if (eventLayer.name === 'Temperature') {
				legend1.addTo(this);
			} else if (eventLayer.name === 'Dewpoint') { 
				legend3.addTo(this);
			} else if (eventLayer.name === 'Windspeed Arrows in km/h') {
				legend2.addTo(this);
			} else {
				legend4.addTo(this);
			}
		});
		
