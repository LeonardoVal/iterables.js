/** `toObject(obj={})` takes an iterable of 2 element arrays and assigns to the given object (or
 * a new one by default) each key-value pairs as a property.
 */
Iterable.prototype.toObject = function toObject(obj) {
	obj = obj || {};
	return lastFromIterator(filteredMapIterator(this, function (pair) {
		obj[pair[0]] = pair[1];
		return obj;
	}), obj);
};

EmptyIterable.prototype.toObject = function toObject(obj) {
	return (obj || {});
};