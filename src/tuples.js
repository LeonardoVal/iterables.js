/** 
*/

/** `zip(iterables...)` builds an iterable that iterates over this and all the given iterables
at the same time, yielding an array of the values of each and stopping at the first sequence
finishing.
*/
Iterable.zipIterator = function zipIterator(zipFunction, lists) {
	var iters = lists.map(__iter__),
		i = -1,
		done = false;
	return {
		next: function next_zipIterator() {
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
		return: function return_zipIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.zipWith = function zipWith(zipFunction) {
	var lists = [this].concat(Array.prototype.slice.call(arguments, 1));
	return new Iterable(Iterable.zipIterator, zipFunction, lists);
};

Iterable.zipWith = function zipWith(zipFunction) {
	var lists = Array.prototype.slice.call(arguments, 1);
	return new Iterable(Iterable.zipIterator, zipFunction, lists);
};

Iterable.prototype.zip = function zip() {
	var args = [__id__].concat(Array.prototype.slice.call(arguments));
	return this.zipWith.apply(this, args);
};

Iterable.zip = Iterable.prototype.zip;

/** `product(iterables...)` builds an iterable that iterates over the
[cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of this and all the given
iterables, yielding an array of the values of each.
*/
Iterable.productIterator = function productIterator(lists) {
	var done = false,
		tuple, iters;
	return {
		next: function next_productIterator() {
			if (!done) {
				if (!iters) { // First tuple.
					iters = lists.map(__iter__);
					tuple = iters.map(function (iter) {
						var x = iter.next();
						done = done || x.done;
						return x.value;
					});
				} else {
					var x;
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
			}
			return done ? { done: true } : { value: tuple.slice(0) }; // Shallow array clone.
		},
		return: function return_productIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.product = function product() {
	var lists = [this].concat(Array.prototype.slice.call(arguments));
	return new Iterable(Iterable.productIterator, lists);
};

Iterable.product = function product() {
	var lists = Array.prototype.slice.call(arguments);
	return new Iterable(Iterable.productIterator, lists);
};