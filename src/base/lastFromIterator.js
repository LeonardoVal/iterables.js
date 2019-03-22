/**
 */
function lastFromIterator(iterator, defaultValue) {
	var obj = iterator.next(),
		value = defaultValue,
		hasValue = arguments.length > 1;
	if (obj instanceof Promise) {
		var asyncFor = function (p) {
			return p.then(function (x) {
				if (x.done) {
					if (hasValue) {
						return value;
					} else {
						throw new Error("Attempted to get the last value of an empty iterator!");
					}
				} else {
					value = x.value;
					hasValue = true;
					return asyncFor(iterator.next());
				}
			});
		};
		return asyncFor(obj);
	} else {
		for (; !obj.done; obj = iterator.next()){
			value = obj.value;
			hasValue = true;
		}
		if (hasValue) {
			return value;
		} else {
			throw new Error("Attempted to get the last value of an empty iterator!");
		}
	}
}
Iterable.lastFromIterator = lastFromIterator;
