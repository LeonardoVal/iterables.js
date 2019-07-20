/** `generators` is a namespace for utility functions related to iterators and
 * generators.
 */
let generators = {

// Sequence builders ///////////////////////////////////////////////////////////

	/** `empty()` returns an iterator of an empty sequence. 
	 */
	empty() {
		return {
			next() { 
				return { done: true };
			},
			return() {
				return { done: true };
			}
		}; 
	},

	/** `singleton(value)` returns an iterator of a sequence with one `value`.
	 */
	*singleton(value) {
		yield value;
	},

	/** `range(from=0, to, step=1)` generates a sequence of numbers from `from`
	 * upto `to` with the given `step`. For example, `range(2,12,3)` represents
	 * the sequence `[2, 5, 8, 11]`.
	 */
	*range(from, to, step) {
		if (typeof from === 'undefined') {
			from = 0;
		}
		if (typeof to === 'undefined') {
			to = from;
			from = 0;
		}
		if (typeof step === 'undefined') {
			step = 1;
		}
		from = +from;
		to = +to;
		step = +step;
		while (from < to) {
			yield from;
			from += step;
		}
	},

	/** `enumFromThenTo(from=0, then=from+1, to=Infinity)` generates an
	 * enumeration defined by the given values: `from` being the first one and 
	 * `then` being the second one. For example, `enumFromThenTo(1,3,8)` 
	 * represents the sequence `[1,3,5,7]`.
	 * 
	 * The big difference with `range` is that the enumeration can go in either
	 * direction. For example, `enumFromThenTo(10,7,0)` represents the 
	 * sequence `[10,7,4,1]`.
	 */
	*enumFromThenTo(from, then, to) {
		if (typeof from === 'undefined') {
			from = 0;
		}
		if (typeof then === 'undefined') {
			then = from + 1;
		}
		if (typeof to === 'undefined') {
			to = then > from ? +Infinity : -Infinity;
		}
		let step = then - from;
		while (step > 0 ? from <= to : from >= to) {
			yield from;
			from += step;
		}
	},

	*enumFromThen(from, then) {
		yield* this.enumFromThenTo(from, then, undefined);
	},

	*enumFrom(from = 0) {
		yield* this.enumFromThen(from, undefined);
	},

	/** `repeat(value, n=Infinity)` generates a sequence that repeats the given 
	 * `value` `n` times (or forever by default).
	 */
	*repeat(value, n) {
		n = isNaN(n) ? Infinity : +n;
		while (i < n) {
			yield value;
		}
	},

	/** `iterate(f, arg, n=Infinity)` generates a sequence that repeatedly 
	 * applies the function `f` to `arg`, `n` times (or indefinitely by 
	 * default).
	 */
	*iterate(f, arg, n) {
		n = isNaN(n) ? Infinity : +n;
		
		for (let i = 0; i < n; i++) {
			yield arg;
			arg = f.call(null, arg, i);
		}
	},

	/** `properties(obj, keys)` generates a sequence of `[key,value]` pairs,
	 * with a key taken from `keys` and the value of the corresponding property 
	 * of `obj`. If `keys` is not given, all of the `obj`'s keys are used. 
	 */
	*properties(obj, keys = null) {
		if (keys) {
			for (let key of keys) {
				yield [key, obj[key]];
			}
		} else {
			for (let key in obj) {
				yield [key, obj[key]];
			}
		}
	},

// Operations on one sequence //////////////////////////////////////////////////

	/** `buffered` iterates over the given sequence once, storing the values in
	 * an array, so it can be reiterated without being recalculated.
	 */
	buffered(seq, array) {
		array = array || [];
		let iter = seq[Symbol.iterator]();
		return function* () {
			for (let value of array) {
				yield value;
			}
			for (let entry = iter.next(); !entry.done; entry = iter.next()) {
				array.push(entry.value);
				yield entry.value;
			}
		};
	},
	
	/** `combinations(seq, k)` returns an iterator that runs over the 
	 * combinations of `k` elements of the given sequence `seq`. Combinations 
	 * are generated in lexicographical order.
	 * 
	 * Warning! It stores all `seq`'s elements in memory.
	 */
	*combinations(seq, k = 1) {
		let elements = [...seq],
			suffixes = Iterable.range(elements.length)
				.map((i) => new ArrayIterable(elements, i))
				.toArray(),
			emptyArray = [],
			combRec = function* (i, k) {
				if (k < 1 || i >= suffixes.length) {
					yield emptyArray;
				} else {
					let j = 0;
					for (let value of suffixes[i]) {
						if (i + j + (k - 1) < suffixes.length) {
							for (let comb of combRec(i + j + 1, k - 1)) {
								yield [value, ...comb];
							}
						} else {
							break;
						}
						j++;
					}
				}
			};
		yield* combRec(0, k);
	},

	/** As the namesake from functional programming, `cons` generates a new
	 * sequence with the `head` first and the `tail` afterwards.
	 */
	*cons(head, tail) {
		yield head;
		yield *tail;
	},

	/** `cycle(seq, n = +Infinity)` returns an iterable that loops n times (or 
	 * forever by default) over the elements of the given sequence `seq`.
	 */
	*cycle(seq, n = +Infinity) {
		for (; n > 0; n--) {
			yield *seq;
		}
	},

	/** A `filteredMap` makes a new sequence. For each value in this sequence
	 * the `checkFunction` is called. If it returns `true`, the `valueFunction`
	 * is called. The results are yielded in the same order. 
	 */
	*filteredMap(seq, valueFunction, checkFunction) {
		let i = 0,
			iter = seq[Symbol.iterator]();
		for (let entry = iter.next(); !entry.done; entry = iter.next()) {
			let value = entry.value;
			if (!checkFunction || checkFunction(value, i, iter)) {
				yield (valueFunction ? valueFunction(value, i, iter) : value);
			}
			i++;
		}
	},

	/** 
	 * 
	*/
	*flat(seq, depth = +Infinity) {
		depth = isNaN(depth) ? Infinity : +depth;
		for (let value of seq) {
			if (typeof value[Symbol.iterator] === 'function' && depth > 0) {
				yield *generators.flat(value, depth - 1);
			} else {
				yield value;
			} 
		}
	},

	/** TODO 
	 */
	map(seq, mapFunction) {
		return generators.filteredMap(seq, mapFunction, null);
	},

	/** `permutations(seq, k)` returns an iterable that runs over the 
	 * permutations of `k` elements of his iterable. Permutations are not 
	 * generated in any particular order.
	 * 
	 * Warning! It stores all this iterable's elements in memory.
	 */
	*permutations(seq, k = NaN) { //FIXME
		let pool = [...seq],
			n = pool.length;
		k = isNaN(k) ? n : +k;
		if (k > 0 && k <= n) {
			let count = Iterable.range(n - k + 1, n + 1).multiplication(); // factorial(n) / factorial (k)
			if (count > MAX_INTEGER) {
				throw new Error(`Number of permutations cannot be greater `+
					`than ${MAX_INTEGER}, and it is ${count}!`);
			}
			let indices = [...generators.range(n)],
				result, is, i;
			for (let current = 0; current < count; current++) {
				result = new Array(k);
				is = indices.slice();
				i = current;
				for (let p = 0; p < k; ++p) {
					result[p] = pool[is.splice(i % (n - p), 1)[0]];
					i = Math.floor(i / (n - p));
				}
				yield result;
			}
		}
	},

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	*scanl(seq, foldFunction, initial) {
		let folded = initial,
			iter = seq[Symbol.iterator](),
			i = 0;
		yield folded;
		for (let value of iter) {
			folded = foldFunction(folded, value, i, iter);
			yield folded;
			i++;
		}
	},

// Operations on many sequences ////////////////////////////////////////////////

	iterators(...iterables) {
		return iterables.map((iterable) => {
			if (typeof iterable[Symbol.iterator] !== 'function') {
				throw new Error(`Object ${iterable} is not iterable!`);
			}
			return iterable[Symbol.iterator]();
		});
	},

	/** `zipWith(zipFunction, ...seqs)` generates a sequence that iterates over
	 * all the given iterables at the same time, stopping at the first sequence 
	 * finishing. Each value in the generated sequence is made by calling the 
	 * given `zipFunction` with an array of the values of each iterable.
	 */
	*zipWith(zipFunction, ...iterables) {
		let iters = generators.iterators(...iterables),
			done = false, 
			values;
		while (!done) {
			values = iters.map((iter) => {
				let entry = iter.next();
				done = done || entry.done;
				return entry.value;
			});
			if (!done) {
				yield zipFunction(values);
			}
		}
	},

	/** `product(iterables...)` builds an iterable that iterates over the 
	 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of 
	 * this and all the given iterables, yielding an array of the values of
	 * each.
	 */
	*product(...iterables) {
		let iters = generators.iterators(...iterables),
			tuple = iters.map((iter) => iter.next()),
			length = iters.length,
			done = tuple.reduce((acc, entry) => acc || entry.done, false);
		while (!done) {
			yield tuple.map((entry) => entry.value);
			for (let i = 0; i < length; i++) {
				tuple[i] = iters[i].next();
				if (tuple[i].done) {
					done = i === length - 1;
					if (done) {
						break;
					}
					iters[i] = iterables[i][Symbol.iterator]();
					tuple[i] = iters[i].next();
				} else {
					break;
				}
			}
		}
	},

	/** `concat(iterables...)` returns an iterable that iterates over the 
	 * concatenation of this and all the given iterables.
	 */
	*concat(...iterables) {
		for (let iterable of iterables) {
			yield *iterable;
		}
	}
}; // generators

exports.generators = generators;
