/** `zip(iterables...)` builds an iterable that iterates over this and all the given iterables at
 * the same time, yielding an array of the values of each and stopping at the first sequence
 * finishing.
 */
$methodOnNLists(function zipWithIterator(lists, zipFunction) {
	if (!lists || !lists.length || lists.length < 1) {
		return Iterable.emptyIterator();
	}
	var otherIters = __iters__(lists.slice(1)),
		values;
	return filteredMapIterator(lists[0], 
		function (value0, index, iter) {
			return zipFunction ? zipFunction(values, index) : values;
		}, function (value0, index, iter) {
			values = [value0];
			var obj;
			for (var i = 0; i < otherIters.length; i++) {
				obj = otherIters[i].next();
				if (obj.done) {
					iter.return();
					return false;
				}
				values.push(obj.value);
			}
			return true;
		}
	);
});
