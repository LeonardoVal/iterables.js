/** `takeWhile(condition)` return an iterable with the first elements that verify the given
`condition`.
*/
$methodOn1List(function takeWhileIterator(list, condition) {
	condition = condition || __toBool__;
	return filteredMapIterator(list, null, function (value, i, iter) {
		if (!condition(value, i, iter)) {
			iter.return();
			return false;
		} else {
			return true;
		}
	});
});
