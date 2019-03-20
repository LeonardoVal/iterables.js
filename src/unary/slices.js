/** `map(mapFunction)` returns an iterable iterating on the results of applying `mapFunction` to 
 * each of this iterable elements.
 */
$methodOn1List(function slicesIterator(list, size) {
	size = isNaN(size) ? 1 : Math.floor(size);
	var iter = __iter__(list),
		slice = [];
	return generatorIterator(function (obj) {
		var x = iter.next();
		if (x instanceof Promise) {
			var asyncLoop = function slicesIterator_asyncLoop(p) {
				return p.then(function (x) {
					if (size < 1 || x.done && slice.length < size) {
						obj.done = true;
					} else {
						slice.push(x.value);
						if (slice.length < size) {
							return asyncLoop(iter.next());
						} else {
							obj.value = slice;
							slice = x.done ? [] : [x.value];
						}
					}
					return obj;
				});
			};
			return asyncLoop(x);
		} else {
			if (size < 1 || x.done && slice.length < 1) {
				obj.done = true;
			} else {
				obj.value = slice;
				while (!x.done && slice.length < size) {
					slice.push(x.value);
					x = iter.next();
				}
				slice = x.done ? [] : [x.value];
			}
			return obj;
		}
	});
});