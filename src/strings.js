/**
*/

/** 
*/
Iterable.iteratorFromString = function iteratorFromString(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Argument must be a string, but is a `'+ typeof string +'`!');
	}
	var i = 0,
		done = false;
	return {
		next: function next_stringIterator() {
			done = done || i >= string.length;
			return done ? { done: true } : { value: string.charAt(i++) };
		},
		return: function return_stringIterator() {
			done = true;
			return { done: true };
		}
	};
};

/**
*/
exports.StringIterable = Iterable.subclass(function StringIterable(string) {
	Iterable.call(this, Iterable.iteratorFromString, string);
	this.__string__ = string;
}, {
	length: function length() {
		return this.__string__.length;
	},
	get: function get(i, defaultValue) {
		return i < 0 || i >= this.length() ? defaultValue : this.__string__.charAt(i);
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
	sep = ''+ (sep || '');
	this.forEach(function (value, i) {
		result += (i === 0) ? value : sep + value;
	});
	return result;
};