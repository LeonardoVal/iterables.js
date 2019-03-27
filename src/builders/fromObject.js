/**
 */
Iterable.fromObject = function fromObject(obj, sortKeys) {
	if (typeof obj !== 'object' || !obj) {
		throw new TypeError('Argument must be an object, but is a `'+ typeof obj +'`!');
	}
	var keys = Object.keys(obj);
	if (sortKeys) {
		keys.sort();
	}
	return this.fromArray(keys).map(function (key) {
		return [key, obj[key]];
	});
};
