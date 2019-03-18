/** 
 */
if (typeof Map === 'function') {
	Iterable.prototype.toMap = function toMap(map) {
		map = map || new Map();
		return lastFromIterator(filteredMapIterator(this, function (pair) {
			map.set(pair[0], pair[1]);
			return map;
		}), map);
	};

	EmptyIterable.prototype.toMap = function toMap(map) {
		return map || new Map();
	};
}