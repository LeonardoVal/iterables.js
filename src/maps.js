/**
*/

/** `map(mapFunction)` returns an iterable iterating on the results of applying `mapFunction` to
each of this iterable elements.
*/
$iterationMethods(function mapIterator(list, mapFunction) {
	return Iterable.filteredMapIterator(list, mapFunction, null);
});

/** 
* /
Iterable.mapFilterIterator = function mapFilterIterator(list, mapFunction, condition) {
	var iter = __iter__(list),
		i = -1,
		done = false;
	condition = condition || __toBool__;
	return {
		next: function next_mapFilterIterator() {
			if (!done) do {
				i++;
				var x = iter.next();
				done = x.done;
				if (!done) {
					var value = mapFunction(x.value, i, iter);
					if (condition(value, i, iter)) {
						return { value: value };
					}
				}
			} while (!done);
			return { done: true };
		},
		return: function return_mapFilterIterator() {
			done = true;
			return { done: true };
		}
	};
};*/