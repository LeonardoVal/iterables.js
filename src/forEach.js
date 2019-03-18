/**
*/
Iterable.prototype.forEach = function forEach(doFunction, ifFunction) {
	return lastFromIterator(filteredMapIterator(list, doFunction, ifFunction));
};