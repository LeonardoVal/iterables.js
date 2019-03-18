/** `drop(n=1)` returns an iterable with the same elements than this, except the first `n` ones.
*/
$methodOn1List(function dropIterator(list, n) {
	n = isNaN(n) ? 1 : Math.floor(n);
	return filteredMapIterator(list, null, function (value, i, iter) {
		return i >= n;
	});
});
