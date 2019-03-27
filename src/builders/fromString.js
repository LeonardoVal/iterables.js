/**
 */
var FromStringIterable = $subtype(function fromStringIterator(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Argument must be a string, but is a `'+ typeof string +'`!');
	}
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= string.length) {
			obj.done = true;
		} else {
			obj.value = string.charAt(i);
		}
	});
});

/** 
 */
Iterable.fromString = function fromString(string) {
	return new exports.FromStringIterable(string);
};
