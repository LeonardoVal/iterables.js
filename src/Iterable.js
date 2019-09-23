import AbstractIterable from './AbstractIterable';

/** General class for representing synchronous sequences.
 * 
 * @augments AbstractIterable
 */
export class Iterable extends AbstractIterable {
	/** @inheritdoc */
	constructor (source) {
		super(source);
	}

	/** Instances of `Iterable` are always synchronous, hence `isAsync` is 
	 * always `false`.
	 */
	get isAsync() {
		return false;
	}

	/** All `Iterable` instances are (of course) _iterable_, hence they have a
	 * `Symbol.iterator` method that returns an iterator.
	 */
	[Symbol.iterator](){
		let source = this.source,
			iterator = typeof source === 'function' ? source() 
				: source[Symbol.iterator]();
		return this.constructor.__iter__(iterator);
	}

	/** A synchronous iterator can be transformed to an asynchronous iterator,
	 * by returning resolved promises. This may be useful for mocking 
	 * asynchronous iterables with synchronous ones.
	 */
	[Symbol.asyncIterator]() {
		let iter = this[Symbol.iterator]();
		return this.__aiter__({
			next() { 
				return Promise.resolve(iter.next());
			}
		});
	}

	/** @inheritdoc */
	filteredMap(valueFunction, checkFunction) {
		let source = generators.filteredMap.bind(generators, this,
			valueFunction, checkFunction);
		return new Iterable(source);
	}

	/** @inheritdoc */
	forEach(doFunction, ifFunction) {
		let result;
		for (result of this) {
			if (!ifFunction || ifFunction(value, i, iter)) {
				result = (doFunction ? doFunction(value, i, iter) : value);
			}
		}
		return result; //FIXME Should forEach return something?
	}

// Builders ////////////////////////////////////////////////////////////////////

	/** Generates an enumeration defined by the given values.
	 * 
	 * @param {number} [from=0] - The first value.
	 * @param {number} [then=1] - The second value.
	 * @param {number} [to=+Infinity] - A bound for the sequence's values. 
	 * @returns {iterable<number>}
	 */
	static enumFromThenTo(from, then, to) {
		return Iterable.range(from, then - from, to, true);
	}

	/** Generates an enumeration defined by the given values.
	 * 
	 * @param {number} [from=0] - The first value.
	 * @param {number} [then=1] - The second value.
	 * @returns {iterable<number>}
	 */
	static enumFromThen(from, then) {
		return Iterable.enumFromThenTo(from, then,
			then > from ? +Infinity : -Infinity);
	}

	/** Generates an enumeration defined by the given values.
	 * 
	 * @param {number} [from=0] - The first value.
	 * @param {number} [to=+Infinity] - A bound for the sequence's values. 
	 * @returns {iterable<number>}
	 */
	static enumFromTo(from, to) {
		return Iterable.enumFromThenTo(from, from + 1, to);
	}

	/** Generates an enumeration defined by the given values.
	 * 
	 * @param {number} [from=0] - The first value. 
	 * @returns {iterable<number>}
	 */
	static enumFrom(from) {
		return Iterable.enumFromTo(from, +Infinity);
	}

	/** Generates a sequence that repeatedly applies the function `f` to the 
	 * value `arg`, `n` times (or indefinitely by default).
	 * 
	 * @param {function (T):T} f - The function to be called.
	 * @param {T} arg - The first argument with which to call `f`.
	 * @param {integer} [n=+Infinity] - The length of the sequence.
	 * @returns {iterable<T>} 
	 */
	static iterate(f, arg, n) {
		let source = generators.iterate.bind(generators, f, arg, n);
		return new this(generators.iterate, f, arg, n);
	}

	/** Iterates over a sequence of numbers from `from` upto `to` with the 
	 * given `step`. 
	 * 
	 * @param {number} [from=0] - The first value in the sequence.
	 * @param {number} to - The last value in the sequence.
	 * @param {number} [step=1] - The difference between each value and the 
	 * 	next in the sequence.
	 * @param {boolean} [rightInclusive=false] - Whether the last values is 
	 * 	included in the sequence or not.
	 * @returns {iterable<number>}
	 */
	static range(from, to, step, rightInclusive = false) {
		return new EnumerationIterable(from, to, step, rightInclusive);
	}

	/** Generates a sequence that repeats the given `value` `n` times (or 
	 * forever by default).
	 * 
	 * @param {T} value - The value to be repeated.
	 * @param {integer} [n=+Infinity] - The length of the sequence.
	 * @returns {iterable<T>} 
	 */
	static repeat(value, n) {
		let source = generators.repeat.bind(generators, value, n);
		return new this(source);
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** Creates a new sequence with all sub-sequence elements of this iterable
	 * concatenated into it recursively up to the specified `depth`.
	 * 
	 * @param {integer} [depth=+Infinity] - A number of recursive steps.
	 * @returns {iterable<T>}
	 */
	flat(depth = +Infinity) {
		let source = generators.flat.bind(generators, this, depth);
		return new Iterable(source);
	}

	/** First maps each element using a `mapFunction`, then flattens the result 
	 * into a new sequence. It is identical to `map()` followed by `flat()` of 
	 * depth 1.
	 *
	 * @param {function(T):iterable<R>} mapFunction
	 * @returns {iterable<R>}
	 */
	flatMap(mapFunction) {
		return this.map(mapFunction).flat(1);
	}

	/** @inheritdoc */
	toArray(array = null) {
		if (!array) {
			array = [...this];
		} else {
			for (let v of this) {
				array.push(v);
			}
		}
		return array;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	has(value, equality = null) {
		let i = equality ? this.indexWhere(equality.bind(null, value)) : 
			this.indexOf(value);
		return i >= 0;
	}

	/** @inheritdoc */
	isEmpty() {
		for (let v of this) {
			return false;
		}
		return true;
	}

	/** @inheritdoc */
	get length() {
		let result = 0;
		for (let _ of this) {
			result++;
		}
		return result;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	reduce(foldFunction, initial) {
		let folded = initial,
			iter = this[Symbol.iterator](),
			i = 0;
		for (let entry = iter.next(); !entry.done; entry = iter.next()) {
			folded = foldFunction(folded, entry.value, i, iter);
			i++;
		} 
		return folded;
	}

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		let source = generators.scanl.bind(generators, this, foldFunction, 
			initial);
		return new Iterable(source);
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	head(defaultValue) {
		for (let v of this) {
			return v;
		}
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	}

	/**  Gets the last value of the sequence `seq`.
	 * 
	 * @param {iterable<T>} seq - The sequence to use.
	 * @param {T} [defaultValue=undefined] - A default value to return if this
	 * 	sequence is empty.
	 * @returns {T}
	 * @throws {Error} If the sequence is empty and no default value is given.
	 */
	static lastValue(seq, defaultValue) { //TODO Move to `generators`
		let value = defaultValue,
			empty = true;
		for (value of seq) {
			empty = false;
		}
		if (empty && arguments.length < 2) {
			throw new Error("Attempted to get the last value of an empty iterator!");
		} else {
			return value;
		}
	}

	/** Gets the last value of this sequence.
	 * 
	 * @param {T} [defaultValue=undefined] - A default value to return if this
	 * 	sequence is empty.
	 * @returns {T}
	 * @throws {Error} If the sequence is empty and no default value is given.
	 */
	lastValue(defaultValue) { //TODO Move to `AbstractIterable`
		let iter = this[Symbol.iterator]();
		if (arguments.length < 1) {
			return Iterable.lastValue(iter);
		} else {
			return Iterable.lastValue(iter, defaultValue);
		}
	}

// Unary operations ////////////////////////////////////////////////////////////

	/** The returned iterable stores all elements of this iterable in an 
	 * `array` the first time they are iterated over. The subsequent iterations
	 * will use the array instead of the source. This prevents the sequence
	 * values to be calculated more than once.
	 * 
	 * @param {T[]} [array=[]] - An array to store the values.
	 * @returns {iterable<T>}
	 */
	buffered(array) {
		array = array || [];
		let source = generators.buffered.bind(generators, this, array);
		return new Iterable(source);
	}

	/** Generates all combinations of `k` values of this sequence, in 
	 * lexicographical order.
	 * 
	 * _Warning!_ Values are stored in memory during the iteration.
	 * 
	 * @param {integer} [k=1] - The number of values in each combination.
	 * @returns {iterable<T[]>}
	 * 
	 * @see generators.permutations
	 */
	combinations(k = 1) {
		let source = generators.combinations.bind(generators, this, k); 
		return new Iterable(source);
	}

	/** As the namesake from functional programming, `cons` generates a new
	 * sequence with the `head` first and the values of this sequence 
	 * afterwards.
	 * 
	 * @param {T} head - The first value in the new sequence.
	 * @returns {iterable<T>}
	 */
	cons(value) {
		let source = generators.cons.bind(generators, value, this);
		return new Iterable(source);
	}

	/** Returns an iterable that loops `n` times (or forever by default) over
	 * the elements of this iterable.
	 * 
	 * @param {integer} [n=+Infinity] - The amount of times this sequence is
	 *   concatenated with itself.
	 * @returns {iterable<T>}
	 */
	cycle(n = +Infinity) {
		let source = generators.cycle.bind(generators, this, n);
		return new Iterable(source);
	}

	/** Generates all permutations of `k` values of this sequence, in no 
	 * particular order.
	 * 
	 * _Warning!_ All values are stored in memory during the iteration.
	 * 
	 * @param {integer} [k=1] - The amount of values in each permutation. By
	 * 	default the length of this sequence is assumed.
	 * @yields {T[]}
	 * 
	 * @see generators.combinations
	*/
	permutations(k = 1) {
		let source = generators.permutations.bind(generators, this, k); 
		return new Iterable(source);
	}

	/** Returns an iterable with this iterable elements in reverse order. 
	 * 
	 * _Warning!_ It stores all this iterable's elements in memory.
	 * 
	 * @returns {iterable<T>}
	 */
	reverse() {
		let reversedArray = this.toArray().reverse();
		return this.constructor.fromArray(reversedArray);
	}

	/** Returns an iterable that goes through this iterable's elements in 
	 * order. 
	 * 
	 * _Warning!_ This iterable's elements are stored in memory for sorting.
	 * 
	 * @param {function(T,T):number} sortFunction - A function with which to 
	 * 	compare the values to sort.
	 * @returns {iterable<T>}
	 */
	sorted(sortFunction) {
		let sortedArray = this.toArray().sort(sortFunction);
		return this.constructor.fromArray(sortedArray);
	}

// Variadic operations /////////////////////////////////////////////////////////
	
	/** Returns an iterable that goes over the concatenation of all the given 
	 * iterables.
	 * 
	 * @param {...iterable<T>} iterables
	 * @returns {iterable<T>} 
	 */
	static concat(...iterables) {
		let source = generators.concat.bind(generators, ...iterables);
		return new Iterable(source);
	}

	/** `zipWith(zipFunction, ...iterables)` builds an iterable that iterates 
	 * over all the given iterables at the same time, stopping at the first 
	 * sequence finishing. Each value in the generated sequence is made by 
	 * calling the given `zipFunction` with an array of the values of each 
	 * iterable.
	 */
	static zipWith(zipFunction, ...iterables) {
		let source = generators.zipWith.bind(generators, zipFunction, 
			...iterables);
		return new Iterable(source);
	}

	/** `product(iterables...)` builds an iterable that iterates over the 
	 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of 
	 * this and all the given iterables, yielding an array of the values of
	 * each.
	 */
	static product(...iterables) {
		let source = generators.product.bind(generators, ...iterables);
		return new Iterable(source);
	}

} // class Iterable
