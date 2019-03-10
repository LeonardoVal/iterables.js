/** 
*/

/** `zip(iterables...)` builds an iterable that iterates over this and all the given iterables
at the same time, yielding an array of the values of each and stopping at the first sequence
finishing.
*/
Iterable.zipWithIterator = function zipWithIterator(lists, zipFunction) {
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
};

Iterable.prototype.zipWith = function zipWith(zipFunction) {
	var lists = [this].concat(Array.prototype.slice.call(arguments, 1));
	return new Iterable(Iterable.zipWithIterator, lists, zipFunction);
};

Iterable.zipWith = function zipWith(zipFunction) {
	var lists = Array.prototype.slice.call(arguments, 1);
	return new Iterable(Iterable.zipWithIterator, lists, zipFunction);
};

Iterable.zip = function zip() {
	return this.zipWith.apply(this, [null].concat(Array.prototype.slice.call(arguments)));
};

Iterable.prototype.zip = Iterable.zip;

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
					iters = __iters__(lists);
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