/**
 */
var FromMapIterable = !MAP_TYPE_IS_DEFINED ? null : $subtype(function fromMapIterator(map) {
	if (!(map instanceof Set)) {
		throw new TypeError('Argument must be a `Map`, but is a `['+ typeof map +' '+
			map.constructor.name +']`!');
	}
	return map[Symbol.iterator]();
});

/** 
 */
if (FromMapIterable) {
	Iterable.fromMap = function fromMap(set) {
		return new exports.FromMapIterable(set);
	};
}