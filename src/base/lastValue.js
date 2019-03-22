/**
 */
Iterable.prototype.lastValue = function lastValue() {
	return lastFromIterator(__iter__(this));
};
