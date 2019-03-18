/** `toArray(array=[])`: appends to `array` the elements of the sequence and returns it. If no
 * array is given, a new one is used.
 */
Iterable.prototype.toArray = function toArray(array) {
	array = array || [];
	return lastFromIterator(filteredMapIterator(this, function (value) {
		array.push(value);
		return array;
	}), array);
};

EmptyIterable.prototype.toArray = function toArray(array) {
	return (array || []);
};

SingletonIterable.prototype.toArray = function toArray(array) {
	return (array || []).concat([this.__value__]);
};

StringIterable.prototype.toArray = function toArray() {
	return this.__string__.split('');
};

ArrayIterable.prototype.toArray = function toArray() {
	return this.__array__.slice();
};