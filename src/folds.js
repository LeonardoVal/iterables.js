/**
*/

/** `foldl(foldFunction, initial)` folds the elements of this iterable with `foldFunction` as a left
associative operator. The `initial` value is used as a starting point, but if it is not defined, 
then the first element in the sequence is used.
*/
Iterable.prototype.foldl = function foldl(foldFunction, initial) {
	var iter = __iter__(this);
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
*/
Iterable.scanlIterator = function scanlIterator(list, foldFunction, initial) {
	var iter = __iter__(list),
		count = -1,
		value = initial,
		hasInitial = typeof value === 'undefined',
		done = false;
	return {
		next: function next_scanlIterator() {
			if (done) {
				return { done: true };
			}
			count++;
			var x;
			if (count === 0) {
				if (!hasInitial) {
					x = iter.next();
					done = x.done;
					if (done) {
						return { done: true };
					} else {
						value = x.value;
					}
				}
				return { value: value };
			} else {
				x = iter.next();
				done = x.done;
				if (done) {
					return { done: true };
				} else {
					value = foldFunction(value, x.value);	
					return { value: value };
				}
			}
		},
		return: function return_scanlIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.scanl = function scanl(foldFunction, initial) {
	return new Iterable(Iterable.scanlIterator, this, foldFunction, initial);
};

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
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
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
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
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