/** `isEmpty()` returns if the sequence has no elements.
 */
Iterable.prototype.isEmpty = function isEmpty() {
	var iter = __iter__(this);
	return then(iter.next(), function (head) {
		return head.done;
	});
};

EmptyIterable.prototype.isEmpty = function isEmpty() {
	return true;
};

SingletonIterable.prototype.isEmpty = function isEmpty() {
	return false;
};

FromStringIterable.prototype.isEmpty = function isEmpty() {
	return this.length() < 1;
};

FromArrayIterable.prototype.isEmpty = function isEmpty() {
	return this.length() < 1;
};