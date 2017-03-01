/* -- 检测插件、H5属性是否支持 -- */
function detect(AttrArray) {

	var obj = {
		state: true,
		str: ""
	};

	AttrArray.forEach(function (ele, index) {
		var detectTerm = {
			state2: ele in document.createElement('span'),
			state3: typeof window[ele] != "undefined",
			state4: ele in new XMLHttpRequest
		};
		if (detectTerm.state2 || detectTerm.state3 || detectTerm.state4) {
			return;
		} else {
			obj.str += ele + " ";
		}
	});

	if (obj.str) {
		obj.str += " is not support!";
		obj.state = false;
		throw new Error(obj.str);
	}

	return obj.state;
}

//detect(["FileReader","kjl","dnd","jquery"]);