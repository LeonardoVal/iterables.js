/** 
 */
Iterable.prototype.length = function length() {
	var result = 0;
	return lastFromIterator(filteredMapIterator(this, function () {
		return ++result;
	}), result);
};

EmptyIterable.prototype.length = function length() {
	return 0;
};

SingletonIterable.prototype.length = function length() {
	return 1;
};

StringIterable.prototype.length = function length() {
	return this.__string__.length;
};

ArrayIterable.prototype.length = function length() {
	return this.__array__.length;
};