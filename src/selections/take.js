/** `take(n=1)` return an iterable with the first `n` elements of this one.
*/
$methodOn1List(function takeIterator(list, n) {
	n = isNaN(n) ? 1 : Math.floor(n);
	return filteredMapIterator(list, null, function (value, i, iter) {
		if (i >= n) {
			iter.return();
			return false;
		} else {
			return true;
		}
	});
});
