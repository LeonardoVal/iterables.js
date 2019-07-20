/**
 */
class AbstractIterable {
	/**
	 */
	constructor (source) {
		Object.defineProperty(this, 'source', { value: source });
	}

	/** `__aiter__` instruments an asynchronous iterator with a `return` method 
	 * if it lacks one. This is necessary in order to interrupt an iteration, 
	 * which is required for many optimization strategies.
	 */
	static __aiter__(iterator) {
		if (iterator.return) {
			return iterator;
		} else {
			let done = false,
				oldNext = iterator.next.bind(iterator);
			return {
				next() {
					return done ? Promise.resolve({ done: true }) 
						: oldNext();
				},
				return() { 
					done = true; 
					return Promise.resolve({ done: true });
				}
			};
		}
	}

	/** `__iter__` instruments an iterator with a `return` method if it lacks
	 * one. This is necessary in order to interrupt an iteration, which is
	 * required for many optimization strategies.
	 */
	static __iter__(iterator) {
		if (!iterator.return) {
			let done = false,
				oldNext = iterator.next.bind(iterator);
			iterator = {
				next() {
					return done ? { done: true } : oldNext();
				},
				return() { 
					done = true; 
					return { done: true };
				}
			};
		}
		return iterator;
	}

	/** The abstract iterable base class cannot be iterated.
	 */
	[Symbol.iterator]() {
		throwUnimplemented('[@@iterator]', this.constructor.name);
	}

	/** The abstract iterable base class cannot be asynchronously iterated.
	 */
	[Symbol.asyncIterator]() {
		throwUnimplemented('[@@asyncIterator]', this.constructor.name);
	}

	/** A `filteredMap` makes a new sequence. For each value in this sequence
	 * the `checkFunction` is called. If it returns `true`, the `valueFunction`
	 * is called. The results are yielded in the same order. 
	 */
	filteredMap(valueFunction, checkFunction) {
		throwUnimplemented('filteredMap', this.constructor.name);
	}

	/** TODO 
	 */
	forEach(doFunction, ifFunction) {
		throwUnimplemented('forEach', this.constructor.name);
	}

// Builders ////////////////////////////////////////////////////////////////////

	/** `fromArray` makes an `Iterable` for the given `array`. 
	 */
	static fromArray(array) {
		if (!Array.isArray(array)) {
			throw new Error(`Expected an array, but got ${array}!`);
		}
		return new ArrayIterable(array);
	}

	/** `fromValues` makes an `Iterable` for the given arguments. 
	 */
	static fromValues() {
		return this.fromArray(Array.prototype.slice.call(arguments));
	}

	/** `fromObject` makes an `Iterable` for the given object `obj`. The
	 * sequence goes over array in the shape `[key, value]`. Key may be sorted
	 * if `sortKeys` is truthy.
	 */
	static fromObject(obj, sortKeys = false) {
		return new ObjectIterable(obj, sortKeys);
	}

	/** `fromString` makes an `Iterable` for the given `string`. If the 
	 * argument is not a string, it is converted to one. 
	 */
	static fromString(string) {
		return new StringIterable(string +"");
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** `map(mapFunction)` returns an iterable iterating on the results of 
	 * applying `mapFunction` to each of this iterable elements.
	 */
	map(mapFunction) {
		return this.filteredMap(mapFunction);
	}

	/** `peephole(n, mapFunction)` is like a map, but takes `n` consequent 
	 * values from the sequence.
	 */
	peephole(n, mapFunction) {
		n = isNaN(n) ? 1 : Math.floor(n);
		let window;
		return this.filteredMap(() => {
			let args = window.slice(); // Shallow copy.
			return mapFunction ? mapFunction(args) : args;
		}, (value, i) => {
			if (i === 0) {
				window = [];
			}
			window.push(value);
			if (window.length > n) {
				window.shift();
			}
			return window.length === n;
		});
	}

	/** `toArray(array=[])`: appends to `array` the elements of the sequence
	 * and returns it. If no array is given, a new one is used.
	 */
	toArray(array = null) {
		array = array || [];
		return this.reduce((obj, value) => {
				array.push(value);
				return array;
			}, array);
	}

	/** `toMap(map=new Map())` takes a sequence of `[key,value]` pairs and puts
	 * each in the given `map` (or a new one by default).
	 */
	toMap(map = null) {
		map = map || new Map();
		return this.reduce((map, [key, value]) => {
				map.set(key, value);
				return map;
			}, map);
	}

	/** `toObject(obj={})` takes a sequence of `[key,value]` pairs and assigns
	 * each as a property of `obj` (or a new object by default).
	 */
	toObject(obj = null) {
		obj = obj || {};
		return this.reduce((obj, [key, value]) => {
				obj[key] = value;
				return obj;
			}, obj);
	}

	/** `toSet(set=new Set())` adds all the values in this sequence to the
	 * given `set`, or a new one by default.
	 */
	toSet(set = null) {
		set = set || new Set();
		return this.reduce((set, value) => {
				set.add(value);
				return set;
			}, set);
	}

// Properties //////////////////////////////////////////////////////////////////

	/** `has(value)` checks if the given `value` occurs in the iterable.
	 */
	has(value) {
		throwUnimplemented('has', this.constructor.name);
	}

	/** `indexOf(value, from=0)` is analogous to the array's namesake method. 
	 * Returns the first position of the given `value`, or -1 if it is not 
	 * found.
	 */
	indexOf(value, from = 0) {
		return this.indicesOf(value, from).head(-1);
	}

	/** `indicesOf(value, from=0)` is a sequence of the positions of the value
	 * in this iterable.
	 */
	indicesOf(value, from = 0) {
		from = Math.floor(from) || 0;
		return this.filteredMap( 
			(_, i) => i,
			(v, i) => v === value && i >= from
		);
	}

	/** `indexWhere(condition, from=0)` returns the position of the first value
	 * of this iterable that complies with the given `condition`, or -1 if 
	 * there is none.
	 */
	indexWhere(condition, from = 0) {
		return this.indicesWhere(condition, from).head(-1);
	}

	/** `indicesWhere(condition, from=0)` is a sequence of the positions in 
	 * this iterable of values that comply with the given `condition`.
 	 */
	indicesWhere(condition, from = 0) {
		return this.filteredMap( 
			(_, i) => i,
			(v, i, iter) => condition(v, i, iter) && i >= from
		);
	}

	/** `isEmpty()` returns if the sequence has no elements.
	 */
	isEmpty() {
		return this.reduce((accum, _value, _i, iter) => {
			iter.return();
			return false;
		}, true);
	}

	/** `length` is the amount of values in the sequence.
	 */
	get length() {
		return this.reduce((accum) => accum + 1, 0);
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** `all(predicate, strict=false)` returns true if for all elements in the 
	 * sequence `predicate` returns true, or if they are all truthy if no 
	 * predicate is given. If the sequence is empty, true is returned.
	 */
	all(predicate, strict = false) {
		predicate = typeof predicate === 'function' ? predicate : __toBool__;
		return this.reduce((result, value, i, iter) => {
			if (!predicate(value, i, iter)) {
				result = false;
				if (!strict) {
					iter.return(); // Shortcircuit.
				}
			}
			return result;
		}, true);
	}

	/** `any(predicate, strict=false)` returns false if for all elements in the
	 * sequence `predicate` returns false, or if the sequence is empty.
	 */
	any(predicate, strict = false) {
		predicate = typeof predicate === 'function' ? predicate : __toBool__;
		return this.reduce((result, value, i, iter) => {
			if (predicate(value, i, iter)) {
				result = true;
				if (!strict) {
					iter.return(); // Shortcircuit.
				}
			}
			return result;
		}, false);
	}

	/** `histogram(key, map = null)` iterates over the whole sequence, counting
	 * the occurance of each value. The results are kept in the given `map`, or
	 * in a new one by default.
	 */
	histogram(key, map = null) {
		let grouping = (count, _value, _i) => (count || 0) + 1;
		return this.groupBy(key, grouping, map);
	}

	/** `groupBy(key, grouping, map = null)` iterates over the whole sequence,
	 * grouping its values according to the key function (`key(value, i)`). 
	 * These keys are used to build a `Map`, where groups are stored. If no 
	 * `key` is given, the values themselves are used as keys.
	 * 
	 * The `grouping` function (`grouping(group, value, i)`) adds values to 
	 * each group. By default values are grouped in arrays. 
	 */
	groupBy(key, grouping = null, map = null) {
		grouping = grouping || ((group, value, i) => {
				group = group || [];
				group.push(value);
				return group;
			});
		map = map || new Map();
		return this.reduce((groupMap, value, i) => {
			let k = key ? key(value, i) : value;
			groupMap.set(k, grouping(groupMap.get(k), value, i));
			return groupMap;
		}, map);
	}

	/** `join(sep='')` concatenates all strings in the sequence using `sep` as
	 * separator. If `sep` is not given, '' is assumed.
	 */
	join(sep = '', prefix = '') {
		sep = ''+ sep;
		if (sep) {
			return this.reduce((accum, value, i) => 
				accum + ((i === 0) ? value : sep + value), prefix);
		} else {
			return this.reduce((accum, value) => accum + value, prefix);
		}
	}

	/** `max(n=-Infinity)` returns the maximum of all numbers in the sequence,
	 * or `-Infinity` if the sequence is empty.
	 */
	max(n = -Infinity) {
		n = isNaN(n) ? -Infinity : +n;
		return this.reduce((n1, n2) => Math.max(n1, n2), n);
	}

	/** `maxBy(compareFunction, defaultValue)` returns the maximum of all 
	 * numbers in the sequence, according to the given `compareFunction`, or 
	 * `defaultValue` if the sequence is empty.
	 */
	maxBy(compareFunction, defaultValue = -Infinity) {
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) < 0 ? v2 : v1,
			defaultValue
		);
	}

	/** `min(n=Infinity)` returns the minimum of all numbers in the sequence,
	 * or `Infinity` if the sequence is empty.
	 */
	min(n = +Infinity) {
		n = isNaN(n) ? +Infinity : +n;
		return this.reduce((n1, n2) => Math.min(n1, n2), n);
	}

	/** `minBy(compareFunction, defaultValue)` returns the maximum of all
	 * numbers in the sequence, according to the given `compareFunction`, or
	 * `defaultValue` if the sequence is empty.
	 */
	minBy(compareFunction, defaultValue = +Infinity) {
		return this.reduce(
			(v1, v2) => compareFunction(v1, v2) > 0 ? v2 : v1,
			defaultValue
		);
	}
	
	/** `multiplication(n=1)` returns the product of all numbers in the 
	 * sequence, or `n` if the sequence is empty.
	 */
	multiplication(n = 1) {
		n = isNaN(n) ? 1 : +n;
		return this.reduce((n1, n2) => n1 * n2, n);
	}

	/** `reduce(foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. The `initial` value 
	 * is used as a starting point, but if it is not defined, then the first 
	 * element in the sequence is used.
	 */
	reduce(foldFunction, initial) {
		return this.scanl(foldFunction, initial).lastValue(initial);
	}

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		throwUnimplemented('scanl', this.constructor.name);
	}

	/** `sum(n=0)` returns the sum of all numbers in the sequence, or `n` if
	 * the sequence is empty.
	 */
	sum(n = 0) {
		n = isNaN(n) ? 0 : +n;
		return this.reduce((n1, n2) => n1 + n2, n);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** `compress(flags)` selects values from this iterable that have a truthy
	 * flag in the same position in the iterable `flags`.
	 */
	compress(flags) {
		return this.zip(flags)
			.filteredMap(([value,]) => value, ([, flag]) => flag);
	}

	/** `drop(n=1)` returns an iterable with the same elements than this, 
	 * except the first `n` ones.
	 */
	drop(n = 1) {
		n = isNaN(n) ? 1 : Math.floor(n);
		return this.slice(n);
	}

	/** `dropWhile(condition)` returns an iterable with the same elements than
	 * this, except the first ones that comply with the condition.
	 */
	dropWhile(condition = null) {
		condition = condition || __toBool__;
		let dropping = false;
		return this.filteredMap(null, (value, i, iter) => {
			dropping = (i === 0 || dropping) && condition(value, i, iter);
			return !dropping;
		});
	}

	/** `filter(filterFunction)` returns an iterable of this iterable elements
	 * for which `condition` returns true.
	 */
	filter(condition) {
		return this.filteredMap(null, condition || __toBool__);
	}

	/** `head(defaultValue)` returns the first element. If the sequence is 
	 * empty it returns `defaultValue`, or raise an exception if none is given.
	 */
	head(defaultValue) {
		throwUnimplemented('head', this.constructor.name);
	}

	/** `get(index, defaultValue)` returns the value at the given `index`, or
	 * `defaultValue` if there is not one.  
	 */
	get(index, defaultValue) {
		let filtered = this.filter((_value, i, _iter) => {
			return i === index;
		});
		return (arguments.length < 2) ? filtered.head() : 
			filtered.head(defaultValue);
	}

	/** `greater(evaluation)` returns an array with the elements of the 
	 * iterable with greater evaluation (or numerical conversion by default).
	 */
	greater(evaluation = null) {
		evaluation = evaluation || __toNumber__;
		var maxEval = -Infinity,
			result = [];
		return this.reduce((result, value) => {
			var e = evaluation(value);
			if (maxEval < e) {
				maxEval = e;
				result = [value];
			} else if (maxEval === e) {
				result.push(value);
			}
		}, result);
	}

	/** `lesser(evaluation)` returns an array with the elements of the iterable
	 * with lesser evaluation (or numerical conversion by default).
	 */
	lesser(evaluation = null) {
		evaluation = evaluation || __toNumber__;
		var minEval = +Infinity,
			result = [];
		return this.reduce((result, value) => {
			var e = evaluation(value);
			if (minEval > e) {
				minEval = e;
				result = [value];
			} else if (minEval === e) {
				result.push(value);
			}
		}, result);
	}

	/** The `nub` of a sequence is another sequence with each element only
	 * appearing once. Basically repeated elements are removed. The argument 
	 * `equality` may have a function to compare the sequence's values.
	 * 
	 * Warning! All the elements of the result are stored in memory.
	 */
	nub(equality = null) {
		let buffer;
		if (equality) {
			return this.filter((value, i) => {
				if (i === 0) {
					buffer = [value];
					return true;
				} else {
					for (let prev of buffer) {
						if (equality(value, prev)) {
							return false;
						}
					}
					buffer.push(value);
					return true;
				}
			});
		} else {
			return this.filter((value, i) => {
				if (i === 0) {
					buffer = new Set();
					buffer.add(value);
					return true;
				} else if (buffer.has(value)) {
					return false;
				} else {
					buffer.add(value);
					return true;
				}
			});
		}
	}

	/** `sample(n=1, rng=Math.random)` gathers `n` values from this iterable at
	 * random, and returns them in an array.
	 */
	sample(n, rng = null) {
		n = +n >= 1 ? Math.floor(n) : 1; 
		rng = rng || Math.random;
		return this.reduce((selected, value, i) => {
			if (i < n) {
				selected.push(value);
			} else {
				let r = Math.floor(rng() * i);
				if (r < n) {
					selected[r] = value;
				}
			}
			return selected;
		}, []);
	}

	/** `slice(begin=0, end=Infinity)` return an iterable over a portion of the
	 * this sequence from `begin` to `end`.
	 */
	slice(begin = 0, end = Infinity) {
		begin = isNaN(begin) ? 0 : Math.floor(begin);
		end = isNaN(end) ? Infinity : Math.floor(end);
		return this.filteredMap(null, (_, i, iter) => {
			if (i >= end) {
				iter.return();
				return false;
			} else {
				return i >= begin;
			}
		});
	}

	/** `tail()` returns an iterable with the same elements than this, except 
	 * the first one.
	 */
	tail() {
		return this.drop(1); //FIXME Should raise an error if this is empty.
	}

	/** `take(n=1)` return an iterable with the first `n` elements of this one.
	 */
	take(n = NaN) {
		n = isNaN(n) ? 1 : Math.floor(n);
		return this.slice(0, n);
	}

	/** `takeWhile(condition)` return an iterable with the first elements that
	 * verify the given `condition`.
	 */
	takeWhile(condition = null) {
		condition = condition || __toBool__;
		return this.filteredMap(null, (value, i, iter) => {
			if (!condition(value, i, iter)) {
				iter.return();
				return false;
			} else {
				return true;
			}
		});
	}

// Unary operations ////////////////////////////////////////////////////////////



// Variadic operations /////////////////////////////////////////////////////////
	
	/** 
	 */
	concat(...iterables) {
		return this.constructor.concat(this, ...iterables);
	}

	/** The `difference(lists, equality)` methods treats the given `lists` as
	 * sets, and calculates the difference of the first with the rest of them.
	 * The `equality` function is used to compare values. If it is not given, 
	 * the standard equality operator (`===`) is used.
	 * 
	 * Warning! Repeated values in this iterable will still be repeated.
	 */
	differenceBy(equality, ...iterables) {
		equality = equality || ((v1, v2) => v1 === v2);
		return this.filter((value) => {
			mainLoop: for (let iterable of iterables) {
				for (let other of iterable) {
					if (equality(value, other)) {
						return false;
					}
					return false;
				}
				return false;
			}
		});
	}

	difference(...iterables) {
		return this.differenceBy(null, ...iterables);
	}
	
	/** The `intersectionBy(equality, ...iterables)` methods treats the given 
	 * `iterables` as sets, and calculates the intersection of all of them with
	 * this iterable. The `equality` function is used to compare values. If it
	 * is not given, the standard equality operator (`===`) is used.
	 * 
	 * Warning! Repeated values in this iterable will still be repeated.
	 */
	intersectionBy(equality, ...iterables) {
		equality = equality || ((v1, v2) => v1 === v2);
		return this.filter((value) => {
			mainLoop: for (let iterable of iterables) {
				for (let other of iterable) {
					if (equality(value, other)) {
						continue mainLoop;
					}
					return false;
				}
				return false;
			}
		});
	}

	intersection(...iterables) {
		return this.intersectionBy(null, ...iterables);
	}

	/** 
	 */
	product(...iterables) {
		return this.constructor.product(this, ...iterables);
	}

	/** 
	 */
	static zip(...iterables) {
		return this.zipWith(__id__, ...iterables);
	}

	/** 
	 */
	zip(...iterables) {
		return this.constructor.zip(this, ...iterables);
	}

	/** 
	 */
	zipWith(zipFunction, ...iterables) {
		return this.constructor.zipWith(zipFunction, this, ...iterables);
	}

} // class AbstractIterable
