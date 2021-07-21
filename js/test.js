// city_point
// http://localhost:8080/geoserver/wca/wms?service=WMS&version=1.1.0&request=GetMap&layers=wca%3Acity_point&bbox=110.229%2C29.5488%2C115.935%2C32.2261&width=768&height=360&srs=EPSG%3A4326&format=application/openlayers
// city_line
// http://localhost:8080/geoserver/wca/wms?service=WMS&version=1.1.0&request=GetMap&layers=wca%3Acity_line&bbox=108.363%2C29.032%2C116.132%2C33.273&width=768&height=419&srs=EPSG%3A4326&format=application/openlayers


// import 'ol/ol.css';
// import Map from 'ol/Map';
// import OSM from 'ol/source/OSM';
// import TileLayer from 'ol/layer/Tile';
// import XYZSource from 'ol/source/XYZ';
// import View from 'ol/View';
// import {fromLonLat} from 'ol/proj';
// import {defaults as defaultControls} from 'ol/control';
// import $ from '../lib/jquery-3.4.1/jquery-3.4.1.min.js';

// let olGd = new TileLayer({
// 		source: new XYZSource({
// 			url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
// 		})
// 	})

// const view = new View({
// 	center: [120.16387, 30.292272], 
// 	projection: 'EPSG:4326', 
// 	zoom: 9,
// 	minZoom:  8,
// 	maxZoom: 10
// });

// const map = new Map({
// 	controls: defaultControls({
// 		zoom: false
// 	}),
// 	layers: [olGd],
// 	target: 'gl-map',
// 	view: view,
// });

// $('#gl-retracticon').click(function() {
// 	$('#gl-retracticon').css('display', 'none');
// 	$('#gl-retracticonrecovery').css('display', 'block');
// 	$('#gl-body').addClass('layui-col-md12 layui-col-lg12');
	
// 	map.updateSize();
// })

// $('#gl-retracticonrecovery').click(function() {
// 	$('#gl-retracticon').css('display', 'block');
// 	$('#gl-retracticonrecovery').css('display', 'none');
// 	$('#gl-body').removeClass('layui-col-md12 layui-col-lg12');
// 	map.updateSize();
// })

// $('#gl-zoomin').click(function() {
// 	view.setZoom(view.getZoom() + 1)
// })

// $('#gl-zoomout').click(function() {
// 	view.setZoom(view.getZoom() - 1)
// })

// var gl_select_tips;
// $(".lg-select").hover(function() {
// 	let value = $(this).find("option:selected").text()
// 	gl_select_tips = layer.tips("<span style='color:#ffffff;'>"+value+"</span>", this, {
// 	  tips: [3, "#000"],
// 	  time: 1000
// 	});
// }, function() {
// 	layer.close(gl_select_tips);
// })

// var gl_float_bar_item_tips;
// $(".lg-float-bar-item").hover(function() {
// 	let value = $(this).attr('data-value');
// 	gl_float_bar_item_tips = layer.tips("<span style='color:#ffffff;'>"+value+"</span>", this, {
// 	  tips: [2, "#000"],
// 	  time: 1000
// 	});
// }, function() {
// 	layer.close(gl_float_bar_item_tips);
// })


// // form.on('radio(gl-maplayers)', function(data) {
// // 	if(data.elem.checked) {
// // 		alert(data.value)
// // 	}
// // })


// $('input[type=radio][name="gl-maplayers"]').change(function() {
// 				alert("Allot Thai Gayo Bhai");
// 		    });