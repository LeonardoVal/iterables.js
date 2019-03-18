/** `indexWhere(condition, from=0)` returns the position of the first value of this iterable that 
 * complies with the given `condition`, or -1 if there is none.
 */
Iterable.prototype.indexWhere = function indexWhere(condition, from) {
	return this.indicesWhere(condition, from).head(-1);
};
