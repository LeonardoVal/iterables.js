/**
 */
var FromSetIterable = !SET_TYPE_IS_DEFINED ? null : $subtype(function fromSetIterator(set) {
	if (!(set instanceof Set)) {
		throw new TypeError('Argument must be a `Set`, but is a `['+ typeof set +' '+
			set.constructor.name +']`!');
	}
	return set[Symbol.iterator]();
});

/** 
 */
if (FromSetIterable) {
	Iterable.fromSet = function fromSet(set) {
		return new exports.FromSetIterable(set);
	};
}
