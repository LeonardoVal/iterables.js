/**
*/
$methodOn1List(function peepholeIterator(list, size, mapFunction) {
	size = isNaN(size) ? 1 : Math.floor(size);
	var window = [];
	return Iterable.filteredMapIterator(list, function () {
		return mapFunction ? mapFunction.apply(null, window) : window.slice(); // Shallow copy.
	}, function (value) {
		window.push(value);
		if (window.length > size) {
			window.shift();
		}
		return window.length === size;
	});
});