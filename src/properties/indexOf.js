/** `indexOf(value, from=0)` is analogous to the array's namesake method. Returns the first 
 * position of the given `value`, or -1 if it is not found.
 */
Iterable.prototype.indexOf = function indexOf(value, from) {
	return this.indicesOf(value, from).head(-1);
};
