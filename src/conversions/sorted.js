/** `sorted(sortFunction)` returns an iterable that goes through this iterable's elements in order. 
 * Warning! This iterable's elements are stored in memory for sorting.
 */
Iterable.prototype.sorted = function sorted(sortFunction) {
	return Iterable.fromArray(this.toArray().sort(sortFunction));
};
