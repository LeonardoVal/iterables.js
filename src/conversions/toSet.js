/** 
 */
if (SET_TYPE_IS_DEFINED) {
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

	FromStringIterable.prototype.toSet = function toSet(set) {
		if (!set) {
			return new Set(this.__string__);
		} else {
			toSet.call(this, set);
		}
	};

	FromArrayIterable.prototype.toSet = function toSet(set) {
		if (!set) {
			return new Set(this.__array__);
		} else {
			toSet.call(this, set);
		}
	};
}