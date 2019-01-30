/**
*/

/** `map(mapFunction)` returns an iterable iterating on the results of applying `mapFunction` to
each of this iterable elements.
*/
Iterable.mapIterator = function mapIterator(list, mapFunction) {
	var iter = __iter__(list),
		i = -1,
		done = false;
	return {
		next: function next_mapIterator() {
			if (!done) {
				i++;
				var x = iter.next();
				done = x.done;
				if (!done) {
					return { value: mapFunction(x.value, i, iter) };
				}
			}
			return { done: true };
		},
		return: function return_mapIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.map = function map(mapFunction) {
	return new Iterable(Iterable.mapIterator, this, mapFunction);
};

/** 
*/
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
};