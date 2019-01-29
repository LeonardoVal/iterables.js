/**
*/

/** `permutations(k)` returns an iterable that runs over the permutations of `k` elements of
this iterable. Permutations are not generated in any particular order.

Warning! It stores all this iterable's elements in memory.
*/
Iterable.permutationsIterator = function permutationsIterator(list, k) {
	k = k|0;
	var pool = list.toArray(),
		n = pool.length;
	if (k < 1 || k > n) {
		return Iterable.emptyIterator();
	} else {
		var count = factorial(n, n - k),
			current = 0,
			indices = Iterable.range(n).toArray(),
			done = false;
		return {
			next: function next_permutationsIterator() {
				done = done || current >= count;
				if (done) {
					return { done: true };
				} else {
					var result = new Array(k),
						is = indices.slice(), // copy indices array.
						i = current;
					for (var p = 0; p < k; ++p) {
						result[p] = pool[is.splice(i % (n - p), 1)[0]];
						i = (i / (n - p)) |0;
					}
					++current;
					return { value: result };
				}
			},
			return: function return_permutationsIterator() {
				done = true;
				return { done: true };
			}
		};
	}
};

Iterable.prototype.permutations = function permutations(k) {
	return new Iterable(Iterable.permutationsIterator, this, k);
};

/** `combinations(k)` returns an iterable that runs over the combinations of `k` elements of
this iterable. Combinations are generated in lexicographical order. The implementations is
inspired in [Python's itertools](https://docs.python.org/3/library/itertools.html#itertools.combinations).

Warning! It stores all this iterable's elements in memory.
*/
Iterable.combinationsIterator = function combinationsIterator(list, k) {
	k = k|0;
	var pool = list.toArray(),
		n = pool.length;
	if (k < 1 || k > n) {
		return Iterable.emptyIterator();
	} else {
		var indices = Iterable.range(k).toArray(),
			current = indices.map(function (i) { 
				return pool[i]; 
			}),
			done = false;
		return {
			next: function next_combinationsIterator() {
				if (done) {
					return { done: true };
				}
				var result = current;
				for (var i = k-1; i >= 0; --i) {
					if (indices[i] !== i + n - k) {
						break;
					}
				}
				if (i < 0) {
					done = true;
				} else {
					indices[i] += 1;
					for (var j = i+1; j < k; ++j) {
						indices[j] = indices[j-1] + 1;
					}
					current = indices.map(function (i) { return pool[i]; });
				}
				return { value: result };
			},
			return: function return_combinationsIterator() {
				done = true;
				return { done: true };
			}
		};
	}
};

Iterable.prototype.combinations = function combinations(k) {
	return new Iterable(Iterable.combinationsIterator, this, k);
};