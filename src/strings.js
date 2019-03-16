/**
*/

/** 
*/
Iterable.stringIterator = function stringIterator(string) {
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
};

/**
*/
exports.StringIterable = Iterable.subclass(function StringIterable(string) {
	Iterable.call(this, Iterable.stringIterator, string);
	this.__string__ = string;
}, {
	length: function length() {
		return this.__string__.length;
	},
	get: function get(i, defaultValue) {
		var found = i >= 0 && i < this.length();
		if (!found && arguments.length < 2) {
			throw new Error("Cannot get value at "+ i +"!");
		}
		return found ? this.__string__.charAt(i) : defaultValue;
	}
});

/** 
*/
Iterable.fromString = function fromString(string) {
	return new exports.StringIterable(string);
};

/** `join(sep='')` concatenates all strings in the sequence using `sep` as separator. If `sep` is
not given, '' is assumed.
*/
Iterable.prototype.join = function join(sep) {
	var result = '';
	sep = sep || '';
	return lastFromIterator(filteredMapIterator(this, function (value, i) {
		result += (i === 0) ? value : sep + value;
		return result;
	}), result);
};