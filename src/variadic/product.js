/** `product(iterables...)` builds an iterable that iterates over the 
 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of this and all the given
 * iterables, yielding an array of the values of each.
 */
$methodOnNLists(function productIterator(lists) {
	if (!Array.isArray(lists)) throw new TypeError('Expected array but got `'+ lists +'`!');//FIXME
	var iters = __iters__(lists),
		tuple;
	return generatorIterator(function (obj) {
		var done = false,
			x;
		if (!tuple) { // First tuple.
			tuple = iters.map(function (iter) {
				var x = iter.next();
				done = done || x.done;
				return x.value;
			});
		} else {
			for (var i = iters.length - 1; i >= 0; i--) { // Subsequent tuples.
				x = iters[i].next();
				if (x.done) {
					if (i > 0) {
						iters[i] = __iter__(lists[i]);
						tuple[i] = iters[i].next().value;
					} else {
						done = true;
					}				
				} else {
					tuple[i] = x.value;
					break;
				}
			}
		}
		if (done) {
			obj.done = true;
		} else { 
			obj.value = tuple.slice(0); // Shallow array clone.
		}
	});
});
