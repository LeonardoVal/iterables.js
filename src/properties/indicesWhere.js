/** `indicesWhere(condition, from=0)` is a sequence of the positions in this iterable of values
 * that comply with the given `condition`.
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
