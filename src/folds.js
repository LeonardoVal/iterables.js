/**
*/

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

/** `foldl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. The `initial` value is used as a starting point, but if it is not defined, 
then the first element in the sequence is used.
*/
Iterable.prototype.foldl = function foldl(foldFunction, initial) {
	return lastFromIterator(this.scanl(foldFunction, initial), initial);
};

/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if the sequence is empty.
*/
Iterable.prototype.sum = function sum(n) {
	n = isNaN(n) ? 0 : +n;
	return this.foldl(function (n1, n2) {
		return n1 + n2;
	}, n);
};

/** `min(n=Infinity)` returns the minimum of all numbers in the sequence, or `Infinity` if the 
sequence is empty.
*/
Iterable.prototype.min = function min(n) {
	n = isNaN(n) ? Infinity : +n;
	return this.foldl(function (n1, n2) {
		return Math.min(n1, n2);
	}, n);
};

/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence, or `-Infinity` if the 
sequence is empty.
*/
Iterable.prototype.max = function max(n) {
	n = isNaN(n) ? Infinity : +n;
	return this.foldl(function (n1, n2) {
		return Math.max(n1, n2);
	}, n);
};

/** `all(predicate, strict=false)` returns true if for all elements in the sequence `predicate`
returns true, or if they are all truthy if no predicate is given. If the sequence is empty, true is
returned.
*/
Iterable.prototype.all = function all(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
	return this.foldl(function (result, value, i, iter) {
		if (!predicate(value, i, iter)) {
			result = false;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
		return result;
	}, true);
};

/** `any(predicate, strict=false)` returns false if for all elements in the sequence `predicate`
returns false, or if the sequence is empty.
*/
Iterable.prototype.any = function any(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
	return this.foldl(function (result, value, i, iter) {
		if (predicate(value, i, iter)) {
			result = true;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
		return result;
	}, false);
};