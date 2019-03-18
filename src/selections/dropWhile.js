/** `dropWhile(condition)` returns an iterable with the same elements than this, except the
first ones that comply with the condition.
*/
$methodOn1List(function dropWhileIterator(list, condition) {
	condition = condition || __toBool__;
	var dropping = true;
	return filteredMapIterator(list, null, function (value, i, iter) {
		dropping = dropping && condition(value, i, iter);
		return !dropping;
	});
});
