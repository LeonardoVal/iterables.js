/**
 */
class AsyncIterable extends AbstractIterable {
	/**
	 */
	constructor (source) {
		super(source);
	}

	/** `isAsync` is `true` for `Iterable`.
	 */
	get isAsync() {
		return true;
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
	
	/** @inheritdoc */
	filteredMap(valueFunction, checkFunction) {
		let source = generators.async.filteredMap.bind(generators, this, 
			valueFunction, checkFunction);
		return new AsyncIterable(source);
	}

	/** @inheritdoc */
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

	/** TODO 
	 */
	ticks(step, end) {
		let source = generators.async.bind(generators, ticks, step, end);
		return new AsyncIterator(source);
	}

// Conversions /////////////////////////////////////////////////////////////////

// Properties //////////////////////////////////////////////////////////////////

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	async reduce(foldFunction, initial) {
		let folded = initial,
			iter = this[Symbol.iterator](),
			i = 0;
		for (let entry = await iter.next(); !entry.done; entry = await iter.next()) {
			folded = foldFunction(folded, entry.value, i, iter);
			i++;
		} 
		return folded;
	}

	/** @inheritdoc */
	scanl(foldFunction, initial) {
		return new AsyncIterable(generators.async.scanl, this, foldFunction, 
			initial);
	}

// Selections //////////////////////////////////////////////////////////////////

// Unary operations ////////////////////////////////////////////////////////////

// Variadic operations /////////////////////////////////////////////////////////
	
} // class AsyncIterable

exports.AsyncIterable = AsyncIterable;
