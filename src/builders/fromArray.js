/**
 */
var FromArrayIterable = $subtype(function fromArrayIterator(array) {
	if (!Array.isArray(array)) {
		throw new TypeError('Argument must be an array, but is a `'+ typeof array +'`!');
	}
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= array.length) {
			obj.done = true;
		} else {
			obj.value = array[i];
		}
	});
});

/** 
 */
Iterable.fromArray = function fromArray(array) {
	return new exports.FromArrayIterable(array);
};

/** 
 */
Iterable.fromValues = function fromValues() {
	return this.fromArray(Array.prototype.slice.call(arguments));
};
