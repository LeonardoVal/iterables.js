/**
*/
Iterable.prototype.isAsync = function isAsync() {
	return !!this[ASYNC_ITERATOR];
};

/** A `mockAsyncIterator` asynchronously iterates over a synchronous iterable. Useful mostly for
testing purposes. 
*/
Iterable.mockAsyncIterator = function mockAsyncIterator(list) {
	var iter = __iter__(list, false),
		done = false;
	return generatorIterator(function (obj) {
		var x = iter.next();
		if (x.done) {
			obj.done = true;
		} else {
			obj.value = x.value;
		}
		return Promise.resolve(obj);
	});
};
Iterable.mockAsyncIterator.isAsync = true;

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
