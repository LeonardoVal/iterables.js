/**
*/

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

/** `toObject(obj={})` takes an iterable of 2 element arrays and assigns to the given object (or
a new one by default) each key-value pairs as a property.
*/
Iterable.prototype.toObject = function toObject(obj) {
	obj = obj || {};
	this.forEach(function (x) {
		obj[x[0]] = x[1];
	});
	return obj;
};