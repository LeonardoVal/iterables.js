/**
 * 
 */
$builderMethod(function ticksIterator(step, end) {
	return generatorIterator(function (obj) {
		if (Date.now() >= end) {
			obj.done = true;
			return Promise.resolve(obj);
		} else {
			return new Promise(function executor(resolve, reject) { 
				setTimeout(function () {
					obj.value = Date.now();
					resolve(obj);
				}, step);
			});
		}
	});
}, true);