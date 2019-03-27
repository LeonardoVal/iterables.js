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

FromStringIterable.prototype.length = function length() {
	return this.__string__.length;
};

FromArrayIterable.prototype.length = function length() {
	return this.__array__.length;
};

if (SET_TYPE_IS_DEFINED) {
	FromSetIterable.prototype.length = function length() {
		return this.__set__.size;
	};
}

if (MAP_TYPE_IS_DEFINED) {
	FromMapIterable.prototype.length = function length() {
		return this.__map__.size;
	};
}