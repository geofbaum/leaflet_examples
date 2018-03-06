		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		
		var map = L.map("map", {
			center: [37.5, -98.05],
			zoom: 4,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				timeInterval: "PT3H/" + currentTime.toISOString(),
				period: "PT10M",
				currentTime: currentTime.getTime(),
			},
			timeDimensionControlOptions: {
				autoPlay: false,
				loopButton: true,
				playReverseButton: true,
				playerOptions: {
					buffer: 10,
					transitionTime: 250,
					//loop: true,
				},
			},
			
		});
		var basemaps = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}").addTo(map);

		//var wmsUrl = "http://geo.weather.gc.ca/geomet/?"
		var wmsLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?', {
			layers: 'RADAR_RDBS',
			format: 'image/png',
			transparent: true,
			opactiy: 0.3,
			crs: L.CRS.EPSG4326,
			attribution: 'Environment and Climate Change Canada'
		});
		var proxy = './proxy.php'
		// Create and add a TimeDimension Layer to the map
		var tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
			wmsVersion: "1.1.1",
			proxy: proxy,
			updateTimeDimension: true,
		});
	
		tdWmsLayer.addTo(map);
		
		var testLegend = L.control({
			position: 'topright'
		});
		testLegend.onAdd = function(map) {
			var src = "http://geo.weather.gc.ca/geomet//?LANG=E%26SERVICE=WMS%26VERSION=1.1.1%26REQUEST=GetLegendGraphic%26STYLE=RADARURPREFLECTS%26LAYER=RADAR_RDBS%26format=image/png";
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src + '" alt="legend">';
			return div;
		};
		testLegend.addTo(map);
		
