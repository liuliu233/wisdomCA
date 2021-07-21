
layui.use(['form', 'layer', 'table', 'jquery', 'layclassify'], function () {
	var form = layui.form;
	var layer = layui.layer;
	var table = layui.table;
	var $ = layui.jquery;
	
	var layclassify = layui.layclassify;
	layclassify.render('#largeClassModal', '#middleClassModal', '#smallClassModal', "#forthClassModal");
	
	// 天地图矢量地图
	var tiandiMap_vec = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=f9073387fa813aada14286a99166bb2c',
			wrapX: false
		})
	})
	
	var cityPoint = new ol.layer.Image({
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
	
	var locationStyle = new ol.style.Style({
		image: new ol.style.Icon({
			crossOrign: 'anonymous',
			scale: 0.3,
			src: '../images/my/location2.png',
		})
	});
	var vectorSource = new ol.source.Vector({
		features: [],
	});
	var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
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
		target: 'gl-map',
		layers: [tiandiMap_vec,
			cityPoint,
			vectorLayer],
		view: view,
	});
		
	table.render({
		elem: '#gl-currentTableId',
		url: '../api/toponym.json',
		height: 'full-200',
		cellMinWidth: 80,
		cols: [[
			{field: 'id', width: 80, title: 'ID', align: 'center', hide: true},
			{field: 'name', minWidth: 200, title: '标准地名', align: 'center', event: 'gl-viewTopoAttrs', style: 'cursor: pointer;'},
			{title: '操作', minWidth: 150, toolbar: '#gl-currentTableBar', align: "center"}
		]],
		limits: [10, 15, 20, 25, 50, 100],
		limit: 10,
		page: true,
		skin: 'line'
		
	});
	
	table.on('rowDouble(gl-currentTableFilter)', function(obj){
		var data = obj.data;
		layer.open({
			type: 1,
			title: data.name,
			area: ['70%', '80%'],
			offset: ['10%', '20%'],
			shade: 0,
			// resize: false,
			maxmin: true,
			move: false,
			anim: 5,
			skin: 'lg-skin',
			content: $('#lg-topoinfodialog'),
			id: 'topoinfo',
			success: function(layero) {
				layero.find('.layui-layer-min').remove();
			}
		});
	});
	
	table.on('tool(gl-currentTableFilter)', function(obj) {
		var data = obj.data;
		if(obj.event === 'gl-viewTopoAttrs') {
			// layer.open({
			// 	type: 1,
			// 	title: data.name,
			// 	area: ['70%', '80%'],
			// 	offset: ['10%', '20%'],
			// 	shade: 0,
			// 	// resize: false,
			// 	maxmin: true,
			// 	move: false,
			// 	anim: 5,
			// 	skin: 'lg-skin',
			// 	content: $('#lg-topoinfodialog'),
			// 	id: 'topoinfo',
			// 	success: function(layero) {
			// 		layero.find('.layui-layer-min').remove();
			// 	}
			// });
		} else if(obj.event === 'gl-location') {
			let center = [121.08387, 31.392272];
			
			vectorSource.getFeatures().forEach(function (feature) {
				vectorSource.removeFeature(feature);
			})
			
			let locationFeature = new ol.Feature({
				geometry: new ol.geom.Point(new ol.proj.fromLonLat(center,'EPSG:4326')),
			});
			locationFeature.setStyle(locationStyle);
			/* 
			{center},{zoom}: 先移动后缩放
			{zoom},{center}: 先缩放后移动
			{center, zoom}: 同时移动后缩放
			 */
			view.animate(
				{center: center},
				{zoom: 16},
				{duration: 1500},
			)
			
			vectorSource.addFeature(locationFeature);
		}
	})
	
	
	$('#gl-retracticon').click(function() {
		$('#gl-retracticon').css('display', 'none');
		$('#gl-retracticonrecovery').css('display', 'block');
		$('#gl-body').addClass('layui-col-md12 layui-col-lg12');
		
		map.updateSize();
	})
	
	$('#gl-retracticonrecovery').click(function() {
		$('#gl-retracticon').css('display', 'block');
		$('#gl-retracticonrecovery').css('display', 'none');
		$('#gl-body').removeClass('layui-col-md12 layui-col-lg12');
		map.updateSize();
	})
	
	$('#gl-zoomin').click(function() {
		view.setZoom(view.getZoom() + 1)
	})
	
	$('#gl-zoomout').click(function() {
		view.setZoom(view.getZoom() - 1)
	})
	
	// var gl_select_tips;
	// $(".lg-select").hover(function() {
	// 	let value = $(this).find("option:selected").text()
	// 	gl_select_tips = layer.tips("<span style='color:#ffffff;'>"+value+"</span>", this, {
	// 	  tips: [3, "#000"],
	// 	  time: 500
	// 	});
	// }, function() {
	// 	layer.close(gl_select_tips);
	// })
	
	var gl_float_bar_item_tips;
	$(".lg-float-bar-item").hover(function() {
		let value = $(this).attr('data-value');
		if(value !== "放大" && value !== "缩小") {
			gl_float_bar_item_tips = layer.tips("<span style='color:#ffffff;'>"+value+"</span>", this, {
			  tips: [2, "#000"],
			  time: 500
			});
		}
	}, function() {
		layer.close(gl_float_bar_item_tips);
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
				cityPoint.set('visible', true);
			}
		} else {
			if(data.value === "gl-shengshijie") {
				cityPoint.set('visible', false);
			}
		}
	})
	
})
 

