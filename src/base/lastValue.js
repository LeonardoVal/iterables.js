/**
 */
Iterable.prototype.lastValue = function lastValue(defaultValue) {
	return arguments.length < 1 ? lastFromIterator(__iter__(this)) :
		lastFromIterator(__iter__(this), defaultValue);
};
