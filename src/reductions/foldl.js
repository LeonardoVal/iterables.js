/** `foldl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. The `initial` value is used as a starting point, but if it is not defined, 
then the first element in the sequence is used.
*/
Iterable.prototype.foldl = function foldl(foldFunction, initial) {
	return this.scanl(foldFunction, initial).lastValue(initial);
};

/** `reduce(foldFunction, initial)` is a synonym for `foldl`.
 */
Iterable.prototype.reduce = Iterable.prototype.foldl;
