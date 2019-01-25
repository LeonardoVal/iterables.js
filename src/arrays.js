/**
*/

/** 
*/
Iterable.iteratorFromArray = function iteratorFromArray(array) {
	if (!Array.isArray(array)) {
		throw new TypeError('Argument must be an array, but is a `'+ typeof array +'`!');
	}
	var i = 0,
		done = false;
	return {
		next: function next_iteratorFromArray() {
			done = done || (i++) >= array.length;
			return done ? { done: true } : { value: array[i - 1] };
		},
		return: function return_iteratorFromArray() {
			done = true;
			return { done: true }; 
		}
	};
};

exports.ArrayIterable = Iterable.subclass(function ArrayIterable(array) {
	Iterable.call(this, Iterable.iteratorFromArray, array);
	this.__array__ = array;
}, {
	length: function length() {
		return this.__array__.length;
	},
	get: function get(i, defaultValue) {
		return i < 0 || i >= this.length() ? defaultValue : this.__array__[i];
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
	this.forEach(function (x) {
		array.push(x);
	});
	return array;
};