/**
*/

/** `indicesWhere(condition, from=0)` is a sequence of the positions in this iterable of values
that comply with the given `condition`.
*/
$methodOn1List(function indicesWhereIterator(list, condition, from) {
	from = Math.floor(from) || 0;
	return filteredMapIterator(list, 
		function (_, i) {
			return i;
		},
		function (v, i, iter) { 
			return condition(v, i, iter) && i >= from; 
		}
	);
});

/** `indexWhere(condition, from=0)` returns the position of the first value of this iterable
that complies with the given `condition`, or -1 if there is none.
*/
Iterable.prototype.indexWhere = function indexWhere(condition, from) {
	return this.indicesWhere(condition, from).head(-1);
};

/** `indicesOf(value, from=0)` is a sequence of the positions of the value in this iterable.
*/
$methodOn1List(function indicesOfIterator(list, value, from) {
	from = Math.floor(from) || 0;
	return filteredMapIterator(list, 
		function (_, i) {
			return i;
		},
		function (v, i) {
			return v === value && i >= from;
		}
	);
});

/** `indexOf(value, from=0)` is analogous to the array's namesake method. Returns the first
	position of the given `value`, or -1 if it is not found.
*/
Iterable.prototype.indexOf = function indexOf(value, from) {
	return this.indicesOf(value, from).head(-1);
};