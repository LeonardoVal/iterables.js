/** `any(predicate, strict=false)` returns false if for all elements in the sequence `predicate`
returns false, or if the sequence is empty.
*/
Iterable.prototype.any = function any(predicate, strict) {
	predicate = typeof predicate === 'function' ? predicate : __toBool__;
	return this.foldl(function (result, value, i, iter) {
		if (predicate(value, i, iter)) {
			result = true;
			if (!strict) {
				iter.return(); // Shortcircuit.
			}
		}
		return result;
	}, false);
};
