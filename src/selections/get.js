/**
 */
Iterable.prototype.get = function get(index, defaultValue) {
	index = Math.floor(index);
	var hasDefault = arguments.length > 1,
		obj = filteredMapIterator(this, null, function (value, i) {
			return i === index;
		}).next();
	return then(obj, function (x) {
		if (x.done) {
			if (hasDefault) {
				return defaultValue;
			} else {
				throw new Error("Cannot get value at "+ index +"!");
			}
		} else {
			return x.value;
		}
	});
};

/** 
 */
EmptyIterable.prototype.get = function get(i, defaultValue) {
	if (arguments.length < 2) {
		throw new Error("Cannot get value at "+ i +"!");
	} else {
		return defaultValue;
	}
};

/** 
 */
StringIterable.prototype.get = function get(i, defaultValue) {
	var found = i >= 0 && i < this.length();
	if (!found && arguments.length < 2) {
		throw new Error("Cannot get value at "+ i +"!");
	}
	return found ? this.__string__.charAt(i) : defaultValue;
};

/** 
 */
ArrayIterable.prototype.get = function get(i, defaultValue) {
	var found = i >= 0 && i < this.length();
	if (!found && arguments.length < 2) {
		throw new Error("Cannot get value at "+ i +"!");
	}
	return found ? this.__array__[i] : defaultValue;
};
