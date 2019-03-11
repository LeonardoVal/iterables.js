/** `all(predicate, strict=false)` returns true if for all elements in the sequence `predicate`
returns true, or if they are all truthy if no predicate is given. If the sequence is empty, true is
returned.
*/
Iterable.prototype.all = function all(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
	return this.foldl(function (result, value, i, iter) {
		if (!predicate(value, i, iter)) {
			result = false;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
		return result;
	}, true);
};
