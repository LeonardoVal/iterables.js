/** `reverse()` returns an iterable with this iterable elements in reverse order. 
 * Warning! It stores all this iterable's elements in memory.
 */
Iterable.prototype.reverse = function reverse() {
	return Iterable.fromArray(this.toArray().reverse());
};
