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
