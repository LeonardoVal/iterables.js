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
