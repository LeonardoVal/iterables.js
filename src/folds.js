/**
*/

/** `foldl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. The `initial` value is used as a starting point, but if it is not defined, 
then the first element in the sequence is used.
*/
Iterable.prototype.foldl = function foldl(foldFunction, initial) {
	var iter = this.__iter__(), 
		x;
	if (typeof initial === 'undefined') {
		initial = iter.next().value;
	}
	var x = iter.next();
	for (var i = 0; !x.done; i++) {
		initial = foldFunction(initial, x.value, i, iter);
		x = iter.next();
	}
	return initial;
};

/** `scanl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. Instead of returning the last result, it iterates over the intermediate values
in the folding sequence.
* /
scanl: function scanl(foldFunction, initial) {
	var from = this; // for closures.
	return new Iterable(function __iter__() {
		var iter = from.__iter__(), value, count = -1;
		return function __scanlIterator__() {
			count++;
			if (count === 0) {
				value = initial === undefined ? iter() : initial;
			} else {
				value = foldFunction(value, iter());
			}
			return value;
		};
	});
},

/** `foldr(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a
right associative operator. The `initial` value is used as a starting point, but if it is not
defined the first element in the sequence is used.

Warning! This is the same as doing a `foldl` in a reversed iterable.
* /
foldr: function foldr(foldFunction, initial) {
	function flippedFoldFunction(x,y) {
		return foldFunction(y,x);
	}
	return this.reverse().foldl(flippedFoldFunction, initial);
},

/** `scanr(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a
right associative operator. Instead of returning the last result, it iterates over the
intermediate values in the folding sequence.

Warning! This is the same as doing a `scanl` in a reversed iterable.
* /
scanr: function scanr(foldFunction, initial) {
	function flippedFoldFunction(x,y) {
		return foldFunction(y,x);
	}
	return this.reverse().scanl(flippedFoldFunction, initial);
},

/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if the sequence is empty.
*/
Iterable.prototype.sum = function sum(n) {
	var result = isNaN(n) ? 0 : +n;
	this.forEach(function (x) {
		result += +x;
	});
	return result;
};

/** `min(n=Infinity)` returns the minimum of all numbers in the sequence, or `Infinity` if the 
sequence is empty.
*/
Iterable.prototype.min = function min(n) {
	var result = isNaN(n) ? Infinity : +n;
	this.forEach(function (x) {
		x = +x;
		if (x < result) {
			result = x;
		}
	});
	return result;
};

/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence, or `-Infinity` if the 
sequence is empty.
*/
Iterable.prototype.max = function max(n) {
	var result = isNaN(n) ? -Infinity : +n;
	this.forEach(function (x) {
		x = (+x);
		if (x > result) {
			result = x;
		}
	});
	return result;
};

/** `all(predicate, strict=false)` returns true if for all elements in the sequence `predicate`
returns true, or if they are all truthy if no predicate is given. If the sequence is empty, true is
returned.
*/
Iterable.prototype.all = function all(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : function (x) { return !!x; };
	var result = true;
	this.forEach(function (x, i, iter) {
		if (!predicate(x, i)) {
			result = false;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
	});
	return result;
};

/** `any(predicate, strict=false)` returns false if for all elements in the sequence `predicate`
returns false, or if the sequence is empty.
*/
Iterable.prototype.any = function any(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : function (x) { return !!x; };
	var result = false;
	this.forEach(function (x, i, iter) {
		if (predicate(x, i)) {
			result = true;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
	});
	return result;
};