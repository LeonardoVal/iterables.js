/** `zip(iterables...)` builds an iterable that iterates over this and all the given iterables at
 * the same time, yielding an array of the values of each and stopping at the first sequence
 * finishing.
 */
$methodOnNLists(function zipWithIterator(lists, zipFunction) {
	return choreographerIterator(lists, function (obj, xs) {
		var done = false,
			values = xs.map(function (x) {
				done = done || x.done;
				x.next = true;
				return x.value;
			});
		if (done) {
			obj.done = true;
		} else {
			obj.value = zipFunction ? zipFunction(values) : values;
		}
	});
});
