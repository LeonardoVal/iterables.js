/**
*/

/** `indexWhere(condition, from=0)` returns the position of the first value of this iterable
that complies with the given `condition`, or -1 if there is none.
*/
Iterable.prototype.indexWhere = function indexWhere(condition, from) {
	var iter = __iter__(this),
		x = iter.next();
	for (var i = 0; !x.done; i++) {
		if (i >= from && condition(x.value, i, iter)) {
			return i;
		}
	}
	return -1;
};

/** `indexesWhere(condition, from=0)` is a sequence of the positions in this iterable of values
that comply with the given `condition`.
*/
Iterable.prototype.indicesWhere = function indexesWhere(condition, from) {
	from = from|0;
	return new Iterable(this.filterMapIterator, this, 
		function (v, i, iter) { return condition(v, i, iter) && i >= from; },
		function (_, i) { return i; }
	);
};

/** `indexOf(value, from=0)` is analogous to the array's namesake method. Returns the first
	position of the given `value`, or -1 if it is not found.
*/
Iterable.prototype.indexOf = function indexOf(value, from) {
	var iter = __iter__(this),
		x = iter.next();
	from = from |0;
	for (var i = 0; !x.done; i++) {
		if (x.value === value && i >= from) {
			return i;
		}
	}
	return -1;
};

/** `indexesOf(value, from=0)` is a sequence of the positions of the value in this iterable.
*/
Iterable.prototype.indicesOf = function indexesOf(value, from) {
	from = from|0;
	return new Iterable(this.filterMapIterator, this, 
		function (v, i) { return v === value && i >= from; },
		function (_, i) { return i; }
	);
};