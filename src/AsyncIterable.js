/**
 */
class AsyncIterable extends AbstractIterable {
	/**
	 */
	constructor (source) {
		super(source);
	}

	/** `isAsync` returns `true` for `Iterable`.
	 */
	get isAsync() {
		return true;
	}

	/** 
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

	/** All `AsyncIterable` instances are (of course) _iterable_, hence they 
	 * have a `Symbol.asyncIterator` method that returns an asynchronous 
	 * iterator.
	 */
	[Symbol.asyncIterator](){
		let iterator = typeof source === 'function' ? source() 
				: source[Symbol.asyncIterator]();
		return AsyncIterable.__aiter__(iterator);
	}
	
	/**
	 */
	filteredMap(valueFunction, checkFunction) {
		let source = generators.filteredMap.bind(generators, this, 
			valueFunction, checkFunction);
		return new AsyncIterable(source);
	}

	/**
	 */
	async forEach(doFunction, ifFunction) {
		let result;
		for await (result of this.filteredMap(doFunction, ifFunction)) {
			if (!ifFunction || await ifFunction(value, i, iter)) {
				result = doFunction ? await doFunction(value, i, iter) 
					: value;
			}
		}
		return result;
	}

// Builders ////////////////////////////////////////////////////////////////////

	ticks(step, end) {
		let source = generators.async.bind(generators, ticks, step, end);
		return new AsyncIterator(source);
	}

// Conversions /////////////////////////////////////////////////////////////////



// Properties //////////////////////////////////////////////////////////////////



// Reductions //////////////////////////////////////////////////////////////////

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		return new AsyncIterable(generators.async.scanl, this, foldFunction, 
			initial);
	}

// Selections //////////////////////////////////////////////////////////////////


// Unary operations ////////////////////////////////////////////////////////////


// Variadic operations /////////////////////////////////////////////////////////
	
} // class Iterable

exports.AsyncIterable = AsyncIterable;
