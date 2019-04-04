/** `maxBy(compareFunction, defaultValue)` returns the maximum of all numbers in the sequence, 
 * according to the given `compareFunction`, or `defaultValue` if the sequence is empty.
 */
Iterable.prototype.maxBy = function maxBy(compareFunction, defaultValue) {
	defaultValue = arguments.length < 2 ? -Infinity : defaultValue;
	return this.reduce(function (v1, v2) {
		return compareFunction(v1, v2) < 0 ? v2 : v1;
	}, defaultValue);
};
