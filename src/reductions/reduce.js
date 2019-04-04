/** `reduce(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a 
 * left associative operator. The `initial` value is used as a starting point, but if it is not 
 * defined, then the first element in the sequence is used.
 */
Iterable.prototype.reduce = function reduce(foldFunction, initial) {
	return this.scanl(foldFunction, initial).lastValue(initial);
};

/**
 */
FromArrayIterable.prototype.reduce = function reduce(foldFunction, initial) {
	return this.__array__.reduce(foldFunction, initial);
};
