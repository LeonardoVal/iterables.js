/** `buffered(array)` stores all elements of the iterable in an `array` and returns it as an 
 * iterable.
 */
Iterable.prototype.buffered = function buffered(array) {
	return Iterable.fromArray(this.toArray(array));
};
