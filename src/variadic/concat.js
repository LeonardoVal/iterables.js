/** `concat(iterables...)` returns an iterable that iterates over the concatenation of this and all 
 * the given iterables.
 */
$methodOnNLists(function concatIterator(lists) {
	var len = lists.length;
	return choreographerIterator(lists, function (obj, xs) {
		var x = xs[xs.length - 1];
		if (x.done) {
			if (xs.length === len) {
				obj.done = true;
			} else {
				xs.push(null);
				return true; // continue
			}
		} else {
			obj.value = x.value;
			x.next = true;
		}
	}, [null]);
});
