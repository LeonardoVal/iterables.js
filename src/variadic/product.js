/** `product(iterables...)` builds an iterable that iterates over the 
 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of this and all the given
 * iterables, yielding an array of the values of each.
 */
$methodOnNLists(function productIterator(lists) {
	return choreographerIterator(lists, function (obj, xs) {
		var length = xs.length;
		for (var i = 0; i < length; i++) {
			if (xs[i].done) {
				if (i === length - 1 || xs[i + 1].done) {
					obj.done = true;
					return false;
				} else {
					xs[i].reset = true;
					xs[i + 1].next = true;
					return true;
				}
			}
		}
		xs[0].next = true;
		obj.value = xs.map(function (x) {
			return x.value;
		});
	});
});
