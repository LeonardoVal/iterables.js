/** `join(sep='')` concatenates all strings in the sequence using `sep` as separator. If `sep` is
 * not given, '' is assumed.
 */
Iterable.prototype.join = function join(sep) {
	var result = '';
	sep = sep || '';
	return lastFromIterator(filteredMapIterator(this, function (value, i) {
		result += (i === 0) ? value : sep + value;
		return result;
	}), result);
};