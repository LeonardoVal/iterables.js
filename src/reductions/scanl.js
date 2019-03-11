/** `scanl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. Instead of returning the last result, it iterates over the intermediate values
in the folding sequence.
*/
$methodOn1List(function scanlIterator(list, foldFunction, initial) {
	var folded = initial;
	return filteredMapIterator(list, function (value, i, iter) {
		folded = foldFunction(folded, value, i, iter);
		return folded;
	});
});
