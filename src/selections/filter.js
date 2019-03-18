/**
*/

/** `filter(filterFunction)` returns an iterable of this iterable elements for which `condition`
returns true.
*/
$methodOn1List(function filterIterator(list, condition) {
	return filteredMapIterator(list, null, condition || __toBool__);
});
