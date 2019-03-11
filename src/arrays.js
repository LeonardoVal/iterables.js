/**
*/

/** 
*/
Iterable.arrayIterator = function arrayIterator(array) {
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
};

exports.ArrayIterable = Iterable.subclass(function ArrayIterable(array) {
	Iterable.call(this, Iterable.arrayIterator, array);
	this.__array__ = array;
}, {
	length: function length() {
		return this.__array__.length;
	},
	get: function get(i, defaultValue) {
		var found = i >= 0 && i < this.length();
		if (!found && arguments.length < 2) {
			throw new Error("Cannot get value at "+ i +"!");
		}
		return found ? this.__array__[i] : defaultValue;
	}
});

/** 
*/
Iterable.fromArray = function fromArray(array) {
	return new exports.ArrayIterable(array);
};

/** 
*/
Iterable.fromValues = function fromValues() {
	return this.fromArray(Array.prototype.slice.call(arguments));
};

/** `toArray(array=[])`: appends to `array` the elements of the sequence and returns it. If no
array is given, a new one is used.
*/
Iterable.prototype.toArray = function toArray(array) {
	array = array || [];
	return lastFromIterator(filteredMapIterator(this, function (value) {
		array.push(value);
		return array;
	}), array);
};