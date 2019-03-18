/**
*/
Iterable.prototype.isAsync = function isAsync() {
	return !!this[ASYNC_ITERATOR];
};
