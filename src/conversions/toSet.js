/** 
 */
if (typeof Set === 'function') {
	var toSet = function toSet(set) {
		set = set || new Set();
		return lastFromIterator(filteredMapIterator(this, function (value) {
			set.add(value);
			return set;
		}), set);
	};
	Iterable.prototype.toSet = toSet;

	EmptyIterable.prototype.toSet = function toSet(set) {
		return set || new Set();
	};

	SingletonIterable.prototype.toSet = function toSet(set) {
		set = set || new Set();
		set.add(this.__value__);
		return set;
	};

	StringIterable.prototype.toSet = function toSet(set) {
		if (!set) {
			return new Set(this.__string__);
		} else {
			toSet.call(this, set);
		}
	};

	ArrayIterable.prototype.toSet = function toSet(set) {
		if (!set) {
			return new Set(this.__array__);
		} else {
			toSet.call(this, set);
		}
	};
}