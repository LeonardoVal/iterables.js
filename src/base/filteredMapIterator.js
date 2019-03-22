/**
 */
function filteredMapIterator(list, valueFunction, checkFunction) {
	var iter = __iter__(list),
		i = -1;
	return generatorIterator(function (obj) {
		var x = iter.next();
		if (x instanceof Promise) {
			var asyncLoop = function filteredMapIterator_asyncLoop(p) {
				return p.then(function (x) {
					if (x.done) {
						obj.done = true;
						return obj;
					} else {
						i++;
						if (checkFunction && !checkFunction(x.value, i, iter)) {
							return asyncLoop(iter.next());
						} else {
							obj.value = valueFunction ? valueFunction(x.value, i, iter) : x.value;
							return obj;
						}
					}
				});
			};
			return asyncLoop(x);
		} else {
			i++;
			while (!x.done && checkFunction && !checkFunction(x.value, i, iter)) {
				x = iter.next();
				i++;
			}
			if (x.done) {
				obj.done = true;
			} else {
				obj.value = valueFunction ? valueFunction(x.value, i, iter) : x.value;
			}
		}
	});
}
Iterable.filteredMapIterator = filteredMapIterator;
