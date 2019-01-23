/**
*/

/** 
*/
Iterable.iteratorFromString = function iteratorFromString(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Argument must be a string, but is a `'+ typeof string +'`!');
	}
	var i = 0;
	return {
		next: function next_stringIterator() {
			i++;
			return (i <= string.length) ? { value: string.charAt(i - 1) } : { done: true };
		},
		return: function return_stringIterator() {
			i = string.length + 1;
			return { done: true };
		}
	};
};

/** 
*/
Iterable.fromString = function fromString(string) {
	return new Iterable(Iterable.iteratorFromString, string);
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