/** `take(n=1)` return an iterable with the first `n` elements of this one.
*/
$methodOn1List(function takeIterator(list, n) {
	n = isNaN(n) ? 1 : Math.floor(n);
	return sliceIterator(list, 0, n);
});
