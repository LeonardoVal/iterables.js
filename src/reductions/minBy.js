/** `minBy(compareFunction, defaultValue)` returns the maximum of all numbers in the sequence, 
 * according to the given `compareFunction`, or `defaultValue` if the sequence is empty.
 */
Iterable.prototype.minBy = function minBy(compareFunction, defaultValue) {
	return this.foldl(function (v1, v2) {
		return compareFunction(v1, v2) > 0 ? v2 : v1;
	}, defaultValue);
};
