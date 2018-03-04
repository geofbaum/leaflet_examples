/* This is an example script used in conjunction with Leaflet in an html file to pull
data from a Web Map Service (WMS) server that we are requesting data from the
NOAA-NCEP High Resolution Rapid Refresh (HRRR) weather model. The HRRR model has a resolution
of 2.5 km and is updated hourly with a run length of 18-hours. This allows us to get more updated
information regarding how the atmosphere is responding without the need to wait 6 to 12 hours in
between model runs which is more typical. */

		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		var endDate = new Date(currentTime.getTime());
		L.TimeDimension.Util.addTimeDuration(endDate, "PT18H", true);
	
		var map = L.map('map', {
			center: [45.25, -73.6159],
			zoom: 9,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				//times: "PT8H/"+"P2D/"+"PT1H"
				timeInterval: currentTime.toISOString() + "/PT18H",
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
    
/* From the WMS server we will only be requesting four layers: 
   Temperature, Dewpoint Temperature, Windspeed and Direction,
   and lastly 1-Hr Accumulated Precipitation. The layers are representing
   expected values at the near surface (2 meters for each of the layers except for the wind which is at 10 meters). */
   
		var temperatureLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Temperature_height_above_ground',
			transparent: true,
			opacity: '0.75',
			format: 'image/png',
			styles: 'boxfill/ferret'
			});
			
		var dewpointLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Dewpoint_temperature_height_above_ground',
			opacity: '0.5',
			styles: 'boxfill/alg2'
			});
		
		var windLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'wind @ Specified height level above ground',
			transparent: true,
			format: 'image/png',
			styles: 'fancyvec/rainbow'
			});
		
		var precipLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Total_precipitation_surface_1_Hour_Accumulation',
			opacity: '0.75',
			format: 'image/png',
			styles: 'boxfill/ferret'
			});
			
		var proxy = 'proxy.php';
			
		var tdTemp = L.timeDimension.layer.wms(temperatureLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdDew = L.timeDimension.layer.wms(dewpointLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdWind = L.timeDimension.layer.wms(windLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdPrecip = L.timeDimension.layer.wms(precipLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		// add Temp Legend
		var legend1 = L.control({position: 'bottomright'});
		legend1.onAdd = function(map) {
			var src1 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Temperature_height_above_ground&PALETTE=ferret"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src1 + '" alt="legend">';
			return div;
		};
		
		// add Dewpoint Legend
		var legend2 = L.control({position: 'bottomright'});
		legend2.onAdd = function(map) {
			var src2 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Dewpoint_temperature_height_above_ground&PALETTE=alg2"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src2 + '" alt="legend">';
			return div;
		};
		
		// add Wind Legend
		var legend3 = L.control({position: 'bottomright'});
		legend3.onAdd = function(map) {
			var src3 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=wind @ Specified height level above ground&PALETTE=rainbow"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src3 + '" alt="legend">';
			return div;
		};
		
		// add Precip Legend
		var legend4 = L.control({position: 'bottomright'});
		legend4.onAdd = function(map) {
			var src4 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Total_precipitation_surface_1_Hour_Accumulation&PALETTE=ferret"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src4 + '" alt="legend">';
			return div;
		};
		
		legend1.addTo(map);
		
		var hrrr = {
			'Temperature': tdTemp,
			
			'Dewpoint temperature': tdDew,
			
			'Wind Speed and Direction at Surface': tdWind,
			
			'Precipitation 1hr Acc': tdPrecip

			};

		L.control.layers(basemaps, hrrr).addTo(map);
		
		hrrr.Temperature.addTo(map);
		basemaps.Google.addTo(map);
		
		// Remove Legends
		map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'Temperature') {
				this.removeControl(legend1);
			} else if (eventLayer.name === 'Dewpoint temperature') {
				this.removeControl(legend2);
			} else if (eventLayer.name === 'Wind Speed and Direction at Surface') {
				this.removeControl(legend3);
			} else {
				this.removeControl(legend4);
			}
		});
		map.on('overlayadd', function (eventLayer) {
		// Add Legends
			if (eventLayer.name === 'Temperature') {
				legend1.addTo(this);
			} else if (eventLayer.name === 'Dewpoint temperature') { 
				legend2.addTo(this);
			} else if (eventLayer.name === 'Wind Speed and Direction at Surface') {
				legend3.addTo(this);
			} else {
				legend4.addTo(this);
			}
		});
		
	
