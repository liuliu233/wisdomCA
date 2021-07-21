layui.define(['layer', 'form', 'laytpl'], function (exports) {
	
	var layer = layui.layer;
	var form = layui.form;
	$ = layui.jquery;
	
	var layclassify = {
		
		classifyList: {
			largeClass_list: {
				11000000: '行政区划及其地区',
				12000000: '陆地地形',
			},
			middleClass_list: {
				11010000: '省级行政区',
				11020000: '地级行政区',
				11030000: '县级行政区',
				11040000: '乡级行政区',
				11050000: '群众自治组织',
				11060000: '非行政区域',
				12010000: '平原',
				12020000: '盆地',
				12030000: '高原',
				12040000: '丘陵山地',
				12050000: '重要陆地景观',
				12060000: '其它陆地地形',
			},
			smallClass_list: {
				
			},
			forthClass_list: {
				
			}
		},
		largeValue: '',
		middleValue: '',
		smallValue: '',
		forthValue: '',
		largeCode: '',
		middleCode: '',
		smallCode: '',
		forthCode: '',
		largeEl: '',
		middleEl: '',
		smallEl: '',
		forthEl: '',
		render: function (largeEl, middleEl, smallEl, forthEl) {
			layclassify.largeEl = largeEl;
			layclassify.middleEl = middleEl;
			layclassify.smallEl = smallEl;
			layclassify.forthEl = forthEl;
			layclassify.renderLargeClass(largeEl);
			
			// 监听结果
			form.on('select(' + $(largeEl).attr('lay-filter') + ')', function(data) {
				layclassify.largeValue = data.value;
				layclassify.largeCode = layclassify.getCode('largeClass', data.value);
				layclassify.renderMiddleClass(layclassify.largeCode);
			});
			form.on('select(' + $(middleEl).attr('lay-filter') + ')', function(data) {
				layclassify.middleValue = data.value;
				if(layclassify.largeCode) {
					layclassify.middleCode = layclassify.getCode('middleClass', data.value, layclassify.largeCode.slice(0, 2));
					layclassify.renderSmallClass(layclassify.middleCode);
				}
			});
			form.on('select(' + $(smallEl).attr('lay-filter') + ')', function(data) {
				layclassify.smallValue = data.value;
				if(layclassify.middleCode) {
					layclassify.smallCode = layclassify.getCode('smallClass', data.value, layclassify.middleCode.slice(0, 4));
					layclassify.renderforthClass(layclassify.smallCode);
				}
			});
			form.on('select(' + $(forthEl).attr('lay-filter') + ')', function(data) {
				layclassify.forthValue = data.value;
				if(layclassify.smallCode) {
					layclassify.forthCode = layclassify.getCode('forthClass', data.value, layclassify.smallCode.slice(0, 6));
				}
			});
		},
		getList: function (type, code) {
			let result = [];
			if(type !== 'largeClass' && !code) {
				return result;
			}
			
			let list = layclassify.classifyList[type + "_list"] || {};
			result = Object.keys(list).map(function (code) {
				return {
					code: code,
					name: list[code]
				}
			})
			
			if(code) {
				result = result.filter(function (item) {
					return item.code.indexOf(code) === 0;
				});
			}
			
			return result;
		},
		getCode: function (type, name, parentCode = 0) {
			let code = '';
			let list = layclassify.classifyList[type + "_list"] || {};
			let result = {};
			Object.keys(list).map(function (_code) {
				if(parentCode) {
					if(_code.indexOf(parentCode) === 0) {
						result[_code] = list[_code];
					}
				} else {
					result[_code] = list[_code];
				}
			});
			
			$.each(result, function(_code, _name){
			    if(_name === name){
			        code = _code;
			    }
			});
		
			return code;
		},
		renderLargeClass: function () {
			let tpl = '<option value="">--请选择大类--</option>';
			let largeClassList = layclassify.getList("largeClass");
            let currentCode = '';
            let currentName = '';
			largeClassList.forEach(function (_item) {
				if(_item.name === layclassify.largeValue){
				    currentCode = _item.code;
				    currentName = _item.name;
				}
				tpl += '<option value="' + _item.name + '">' + _item.name + '</option>';
			});
			
			$(layclassify.largeEl).html(tpl);
			$(layclassify.largeEl).val(layclassify.largeValue);
			form.render('select');
            layclassify.renderMiddleClass(currentCode);
		},
		renderMiddleClass: function (largeCode) {
			let tpl = '<option value="">--请选择中类--</option>';
			let middleClassList = layclassify.getList('middleClass', largeCode.slice(0, 2));
            let currentCode = '';
            let currentName = '';
			middleClassList.forEach(function (_item) {
				if(_item.name === layclassify.middleValue){
                    currentCode = _item.code;
                    currentName = _item.name;
                }
				tpl += '<option value="'+_item.name+'">'+_item.name+'</option>';
			});
			
			$(layclassify.middleEl).html(tpl);
			$(layclassify.middleEl).val(layclassify.middleValue);
			form.render('select');
			layclassify.renderSmallClass(currentCode);
		},
		renderSmallClass: function (middleCode) {
			let tpl = '<option value="">--请选择小类--</option>';
			let smallClassList = layclassify.getList('smallClass', middleCode.slice(0, 4));
			let currentCode = '';
			let currentName = '';
			smallClassList.forEach(function (_item) {
				if(_item.name === layclassify.smallValue){
				    currentCode = _item.code;
				    currentName = _item.name;
				}
				tpl += '<option value="'+_item.name+'">'+_item.name+'</option>';
			});
			
			$(layclassify.smallEl).html(tpl);
			$(layclassify.smallEl).val(layclassify.smallValue);
			form.render('select');
			layclassify.renderForthClass(currentCode);
		},
		renderForthClass: function (smallCode) {
			let tpl = '<option value="">--请选择细分类--</option>';
			let forthClassList = layclassify.getList('forthClass', smallCode.slice(0, 6));
			let currentCode = '';
			let currentName = '';
			forthClassList.forEach(function (_item) {
				if(_item.name === layclassify.forthValue){
				    currentCode = _item.code;
				    currentName = _item.name;
				}
				tpl += '<option value="'+_item.name+'">'+_item.name+'</option>';
			});
			
			$(layclassify.forthEl).html(tpl);
			$(layclassify.forthEl).val(layclassify.forthValue);
			form.render('select');
		}
	};
	
	
	exports('layclassify', layclassify);
});