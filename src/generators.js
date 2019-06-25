/**
 */
let generators = {

// Sequence builders ///////////////////////////////////////////////////////////

	/** `range(from=0, to, step=1)` builds an Iterable object with number from 
	 * `from` upto `to` with the given `step`. For example, `range(2,12,3)` 
	 * represents the sequence `[2, 5, 8, 11]`.
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

	/** `enumFromThenTo(from=0, then=from+1, to=Infinity)` builds an Iterable 
	 * object that goes over enumeration defined by the given values: `from` 
	 * being the first one and `then` being the second one. For example, 
	 * `enumFromThenTo(1,3,8)` represents the sequence `[1,3,5,7]`.
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

	/** `repeat(value, n=Infinity)` builds an iterable that repeats the given 
	 * `value` `n` times (or forever by default).
	 */
	*repeat(value, n) {
		n = isNaN(n) ? Infinity : +n;
		while (i < n) {
			yield value;
		}
	},

	/** `iterate(f, arg, n=Infinity)` returns an iterable that repeatedly 
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

// Operations on one sequence //////////////////////////////////////////////////

	*filteredMap(seq, valueFunction, checkFunction) {
		let i = 0,
			iter = seq[Symbol.iterator]();
		for (let value of iter) {
			if (!checkFunction && checkFunction(value, i, iter)) {
				yield (valueFunction ? valueFunction(value, i, iter) : value);
			}
			i++;
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
	}
};

exports.generators = generators;

// Iterable methods for sequence builders. /////////////////////////////////////

['range', 'enumFromThenTo', 'enumFromThen', 'enumFrom', 'repeat', 'iterate'
].forEach((methodName) => {
	let generator = generators[methodName];
	if (generator && !Iterable[methodName]) {
		Object.defineProperty(Iterable, methodName, { 
			value: function () {
				return new Iterable(generator.apply(this, arguments));
			}
		});
	}
});

// Iterable methods for operations on one sequence. ////////////////////////////

['filteredMap', 'scanl'
].forEach((methodName) => {
	let generator = generators[methodName];
	if (generator && !Iterable[methodName]) {
		Object.defineProperty(Iterable.prototype, methodName, { 
			value: function () {
				let args = [this, ...arguments];
				return new Iterable(generator.apply(this, args));
			}
		});
	}
});
