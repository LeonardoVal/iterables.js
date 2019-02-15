/** 
*/

/** `zip(iterables...)` builds an iterable that iterates over this and all the given iterables
at the same time, yielding an array of the values of each and stopping at the first sequence
finishing.
*/
Iterable.zipWithIterator = function zipWith(zipFunction, lists) {
	var iters = lists.map(__iter__),
		i = -1,
		done = false;
	return {
		next: function next_mapIterator() {
			if (!done) {
				i++;
				var values = iters.map(function (iter) {
						var x = iter.next();
						done = done || x.done;
						return x.value;
					});
				if (!done) {
					return { value: zipFunction(values, i, iters) };
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

Iterable.prototype.zipWith = function zipWith(zipFunction) {
	var lists = [this].concat(Array.prototype.slice.call(arguments, 1));
	return new Iterable(Iterable.zipWithIterator, zipFunction, lists);
};

Iterable.zipWith = function zipWith(zipFunction) {
	var lists = Array.prototype.slice.call(arguments, 1);
	return new Iterable(Iterable.zipWithIterator, zipFunction, lists);
};

Iterable.prototype.zip = function zip() {
	var args = [__id__].concat(Array.prototype.slice.call(arguments));
	return this.zipWith.apply(this, args);
};

Iterable.zip = Iterable.prototype.zip;