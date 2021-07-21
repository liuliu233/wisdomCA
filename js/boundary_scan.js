
layui.use(['form', 'layer', 'jquery'], function () {
	var form = layui.form;
	var layer = layui.layer;
	var $ = layui.jquery;
	
	// 天地图矢量地图
	var tiandiMap_vec = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=f9073387fa813aada14286a99166bb2c',
			wrapX: false
		})
	})
	
	var cityPointWMS = new ol.layer.Image({
		visible: false,
		source: new ol.source.ImageWMS({
			ratio: 1,
			url: 'http://localhost:8080/geoserver/wca/wms',
			params: {'FORMAT': 'image/png',
				'VERSION': '1.1.1',
				'LAYERS': 'wca:city_point',
				'exceptions': 'application/vnd.ogc.se_inimage',
				}
		})
	})
	
	var cityPolygonWFS = new ol.layer.Vector({
		name: "CityPolygonWFS",
		source: new ol.source.Vector({
			url: "http://localhost:8080/geoserver/wca/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=wca%3Acity_poly&maxFeatures=50&outputFormat=application%2Fjson",
			format: new ol.format.GeoJSON({
				geometryName: 'MultiPolygon'
			}),
			wrapX: false
		}),
	})
	
	var drawLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [],
		}),
	})
	
	var view = new ol.View({
		center: [112, 31], 
		projection: 'EPSG:4326', 
		zoom: 9,
		minZoom: 2,
		maxZoom: 18,
	});
	
	var map = new ol.Map({
		controls: ol.control.defaults({
			attribution: false,
			zoom: false,
		}),
		target: 'gl-boundary-map',
		layers: [tiandiMap_vec],
		view: view,
	});
	map.addLayer(cityPointWMS);
	map.addLayer(cityPolygonWFS);
	map.addLayer(drawLayer);
	
	// GeoServer图层交互
	var singleSelect = new ol.interaction.Select();
	var modify = new ol.interaction.Modify({
		features: singleSelect.getFeatures(),
	});
	
	$('#gl-zoomin').click(function() {
		view.setZoom(view.getZoom() + 1);
	})
	
	$('#gl-zoomout').click(function() {
		view.setZoom(view.getZoom() - 1);
	})
	
	
	form.on('radio(gl-maplayers)', function(data) {
		if(data.elem.checked) {
			if(data.value === "矢量地图") {
				let tiandiMap_vec = new ol.source.XYZ({
				    url:'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=f9073387fa813aada14286a99166bb2c',
					wrapX: false
				});
				let baseLayer = map.getLayers().item(0);
				baseLayer.setSource(tiandiMap_vec);
			} else if(data.value === "影像地图") {
				let tiandiMap_img = new ol.source.XYZ({
				    url:'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=f9073387fa813aada14286a99166bb2c',
					wrapX: false
				});
				let baseLayer = map.getLayers().item(0);
				baseLayer.setSource(tiandiMap_img);
			}
		}
	})
	
	form.on('checkbox(gl-boundary)', function(data) {
		if(data.elem.checked) {
			if(data.value === "gl-shengshijie") {
				cityPointWMS.set('visible', true);
			}
		} else {
			if(data.value === "gl-shengshijie") {
				cityPointWMS.set('visible', false);
			}
		}
	})
	
	$(".lg-float-bar-item").hover(function() {
		let value = $(this).attr('data-value');
		if(value === "放大") {
			$(this).css("background", "url(../images/my/zoomin_ac.png) center no-repeat");
		} else if (value === "缩小") {
			$(this).css("background", "url(../images/my/zoomout_ac.png) center no-repeat");
		} else if (value === "图层选择") {
			$(this).css("background", "url(../images/my/yx_ac.png) center no-repeat");
		} else if (value === "矢量图") {
			$(this).css("background", "url(../images/my/pingmian_ac.png) center no-repeat");
		}
	}, function() {
		let value = $(this).attr('data-value');
		if(value === "放大") {
			$(this).css("background", "url(../images/my/zoomin_h.png) center no-repeat");
		} else if (value === "缩小") {
			$(this).css("background", "url(../images/my/zoomout_h.png) center no-repeat");
		} else if (value === "图层选择") {
			$(this).css("background", "url(../images/my/yx_h.png) center no-repeat");
		} else if (value === "矢量图") {
			$(this).css("background", "url(../images/my/pingmian_h.png) center no-repeat");
		}
	})

	$('#gl-select').click(function () {
		let value = $(this).attr('data-value');
		if(value === "unselected") {
			map.addInteraction(singleSelect);
			$(this).attr('data-value', 'selected');
			$(this).attr('src', '../images/my/select2.png');
		} else if (value === "selected") {
			singleSelect.getFeatures().clear();
			map.removeInteraction(singleSelect);
			map.removeInteraction(modify);
			$(this).attr('data-value', 'unselected');
			$(this).attr('src', '../images/my/select.png');
		}
		
	})
	
	$('#gl-edit').click(function () {
		let value = $(this).attr('data-value');
		if($('#gl-select').attr('data-value') === "selected" && value === "unedited") {
			map.addInteraction(modify);
			$(this).attr('data-value', 'edited');
			$(this).attr('src', '../images/my/edit1.png');
		} else if (value === "edited") {
			map.removeInteraction(modify);
			$(this).attr('data-value', 'unedited');
			$(this).attr('src', '../images/my/edit2.png');
		}
	})
	
	let draw;
	let isStartDraw = false;
	$('#gl-draw').click(function () {
		let value = $(this).attr('data-value');
		if(value === "stop") {
			$(this).attr('data-value', 'start');
			$(this).attr('src', '../images/my/start.png');
			isStartDraw = true;
		} else if (value === "start") {
			$(this).attr('data-value', 'stop');
			$(this).attr('src', '../images/my/stop.png');
			isStartDraw = false;
			map.removeInteraction(draw);
			if($('#gl-point').attr('data-value') === "draw") {
				$('#gl-point').attr('data-value', 'undraw');
				$('#gl-point').attr('src', '../images/my/point.png');
			}
			if ($('#gl-polygon').attr('data-value') === "draw") {
				$('#gl-polygon').attr('data-value', 'undraw');
				$('#gl-polygon').attr('src', '../images/my/polygon.png');
			}
			if ($('#gl-line').attr('data-value') === "draw") {
				$(this).attr('data-value', 'undraw');
				$(this).attr('src', '../images/my/line.png');
				map.removeInteraction(draw);
			}
		}
	})
	$('#gl-point').click(function () {
		if(isStartDraw) {
			if ($('#gl-polygon').attr('data-value') === "draw") {
				$('#gl-polygon').attr('data-value', 'undraw');
				$('#gl-polygon').attr('src', '../images/my/polygon.png');
				map.removeInteraction(draw);
			}
			if($('#gl-line').attr('data-value') === "draw") {
				$('#gl-line').attr('data-value', 'undraw');
				$('#gl-line').attr('src', '../images/my/line.png');
				map.removeInteraction(draw);
			}
			
			let value = $(this).attr('data-value');
			if(value === "undraw") {
				$(this).attr('data-value', 'draw');
				$(this).attr('src', '../images/my/point1.png');
				map.removeInteraction(draw);
				draw = new ol.interaction.Draw({
					source: drawLayer.getSource(),
					type: 'Point',
				});
				map.addInteraction(draw);
			} else if (value === "draw") {
				$(this).attr('data-value', 'undraw');
				$(this).attr('src', '../images/my/point.png');
				map.removeInteraction(draw);
			}
		}
		
	})
	$('#gl-line').click(function () {
		if(isStartDraw) {
			if ($('#gl-polygon').attr('data-value') === "draw") {
				$('#gl-polygon').attr('data-value', 'undraw');
				$('#gl-polygon').attr('src', '../images/my/polygon.png');
				map.removeInteraction(draw);
			}
			if($('#gl-point').attr('data-value') === "draw") {
				$('#gl-point').attr('data-value', 'undraw');
				$('#gl-point').attr('src', '../images/my/point.png');
				map.removeInteraction(draw);
			}
			
			let value = $(this).attr('data-value');
			if(value === "undraw") {
				$(this).attr('data-value', 'draw');
				$(this).attr('src', '../images/my/line2.png');
				map.removeInteraction(draw);
				draw = new ol.interaction.Draw({
					source: drawLayer.getSource(),
					type: 'LineString',
				});
				map.addInteraction(draw);
			} else if (value === "draw") {
				$(this).attr('data-value', 'undraw');
				$(this).attr('src', '../images/my/line.png');
				map.removeInteraction(draw);
			}
		}
		
	})
	$('#gl-polygon').click(function () {
		if(isStartDraw) {
			if($('#gl-point').attr('data-value') === "draw") {
				$('#gl-point').attr('data-value', 'undraw');
				$('#gl-point').attr('src', '../images/my/point.png');
				map.removeInteraction(draw);
			}
			if($('#gl-line').attr('data-value') === "draw") {
				$('#gl-line').attr('data-value', 'undraw');
				$('#gl-line').attr('src', '../images/my/line.png');
				map.removeInteraction(draw);
			}
			
			
			let value = $(this).attr('data-value');
			if(value === "undraw") {
				$(this).attr('data-value', 'draw');
				$(this).attr('src', '../images/my/polygon1.png');
				map.removeInteraction(draw);
				draw = new ol.interaction.Draw({
					source: drawLayer.getSource(),
					type: 'Polygon',
				})
				map.addInteraction(draw);
			} else if (value === "draw") {
				$(this).attr('data-value', 'undraw');
				$(this).attr('src', '../images/my/polygon.png');
				map.removeInteraction(draw);
			}
		}
	})
	$('#gl-clear').click(function () {
		
		drawLayer.getSource().clear();
	})
})
