/**
*/

/** `filter(filterFunction)` returns an iterable of this iterable elements for which `condition`
returns true.
*/
$iterationMethods(function filterIterator(list, condition) {
	return filteredMapIterator(list, null, condition || __toBool__);
});

/** `takeWhile(condition)` return an iterable with the first elements that verify the given
`condition`.
*/
$iterationMethods(function takeWhileIterator(list, condition) {
	condition = condition || __toBool__;
	return filteredMapIterator(list, null, function (value, i, iter) {
		if (!condition(value, i, iter)) {
			iter.return();
			return false;
		} else {
			return true;
		}
	});
});

/** `take(n=1)` return an iterable with the first `n` elements of this one.
*/
$iterationMethods(function takeIterator(list, n) {
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

/** `head(defaultValue)` returns the first element. If the sequence is empty it returns 
`defaultValue`, or raise an exception if none is given.
*/
Iterable.prototype.head = function head(defaultValue) {
	var x = __iter__(this).next();
	if (x.done) {
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	} else {
		return x.value;
	}
};

/** `dropWhile(condition)` returns an iterable with the same elements than this, except the
first ones that comply with the condition.
*/
$iterationMethods(function dropWhileIterator(list, condition) {
	condition = condition || __toBool__;
	var dropping = true;
	return filteredMapIterator(list, null, function (value, i, iter) {
		dropping = dropping && condition(value, i, iter);
		return !dropping;
	});
});

/** `drop(n=1)` returns an iterable with the same elements than this, except the first `n` ones.
*/
$iterationMethods(function dropIterator(list, n) {
	n = isNaN(n) ? 1 : Math.floor(n);
	return filteredMapIterator(list, null, function (value, i, iter) {
		return i >= n;
	});
});

/** `tail()` returns an iterable with the same elements than this, except the first one.
*/
Iterable.prototype.tail = function tail() {
	return this.drop(1); //FIXME Should raise an error if this is empty.
};

/** `greater(evaluation)` returns an array with the elements of the iterable with greater evaluation
(or numerical conversion by default).
*/
Iterable.prototype.greater = function greater(evaluation) {
	evaluation = typeof evaluation === 'function' ? evaluation : __toNumber__;
	var maxEval = -Infinity,
		result = [];
	this.forEach(function (x) {
		var e = evaluation(x);
		if (maxEval < e) {
			maxEval = e;
			result = [x];
		} else if (maxEval === e) {
			result.push(x);
		}
	});
	return result;
};

/** `lesser(evaluation)` returns an array with the elements of the iterable with lesser evaluation
(or numerical conversion by default).
*/
Iterable.prototype.lesser = function lesser(evaluation) {
	evaluation = typeof evaluation === 'function' ? evaluation : __toNumber__;
	var minEval = +Infinity,
		result = [];
	this.forEach(function (x) {
		var e = evaluation(x);
		if (minEval > e) {
			minEval = e;
			result = [x];
		} else if (minEval === e) {
			result.push(x);
		}
	});
	return result;
};