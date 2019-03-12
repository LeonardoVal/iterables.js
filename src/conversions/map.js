/**
*/

/** `map(mapFunction)` returns an iterable iterating on the results of applying `mapFunction` to
each of this iterable elements.
*/
$methodOn1List(function mapIterator(list, mapFunction) {
	return Iterable.filteredMapIterator(list, mapFunction, null);
});