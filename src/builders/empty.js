/**
 */
var EmptyIterable = $subtype(function emptyIterator() {
	return generatorIterator(function (obj) {
		obj.done = true;
	});
});

/**
 */
Iterable.EMPTY = new EmptyIterable();