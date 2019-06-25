/**
 */
class Iterable {
	/**
	 */
	constructor (source) {
		Object.defineProperty(this, 'source', { value: source });
	}

	/**
	 */
	isAsync() {
		return false;
	}

	/** 
	 */
	[Symbol.iterator](){
		let source = this.source,
			iterator = typeof source === 'function' ? source 
				: source[Symbol.iterator]();
		if (iterator.return) {
			return iterator;
		} else {
			let done = false;
			return {
				next() {
					return done ? { done: true } 
						: { value: iterator.next() };
				},
				return() { 
					done = true; 
					return { done: true };
				}
			};
		}
	}

	static *filteredMapIterator(iter, valueFunction, checkFunction) {
		let i = 0;
		for (let value of iter) {
			if (!checkFunction && checkFunction(value, i, iter)) {
				yield (valueFunction 
					? valueFunction(value, i, iter) : value);
			}
			i++;
		}
	}

	/** 
	 */
	filteredMap(valueFunction, checkFunction) {
		let iter = this[Symbol.iterator](),
			base = Iterable.filteredMapIterator(iter, valueFunction, checkFunction);
		return new Iterable(base);
	}

	static lastValueFromIterator(iter, defaultValue) {
		let value = defaultValue,
			empty = true;
		for (value of iter) {
			empty = false;
		}
		if (empty && arguments.length < 2) {
			throw new Error("Attempted to get the last value of an empty iterator!");
		} else {
			return value;
		}
	}

	/**
	 */
	lastValue(defaultValue) {
		let iter = this[Symbol.iterator]();
		if (arguments.length < 1) {
			return Iterable.lastValueFromIterator(iter);
		} else {
			return Iterable.lastValueFromIterator(iter, defaultValue);
		}
	}
} // class Iterable

function _methods(clazz, methods) {
	for (let name in methods) {
		Object.defineProperty(clazz.prototype, name, { value: methods[name] });
	}
}

_methods(Iterable, {
	forEach(doFunction, ifFunction) {
		let iter = this[Symbol.iterator](),
			iter2 = Iterable.filteredMapIterator(iter, doFunction, ifFunction);
		return Iterable.lastValueFromIterator(iter2);
	}
});

const EMPTY_ITERATOR = {
		next() { 
			return { done: true };
		},
		return() {
			return { done: true };
		}
	};

let SINGLETON_EmptyIterable = null;

class EmptyIterable extends Iterable {
	constructor() {
		if (SINGLETON_EmptyIterable) {
			return SINGLETON_EmptyIterable;
		} else {
			SINGLETON_EmptyIterable = this;
			super(null);
		}
	}

	[Symbol.iterator]() {
		return EMPTY_ITERATOR;
	}
}

////////////////////////////////////////////////////////////////////////////////


function Iterable(iteratorFunction) {
	if (typeof iteratorFunction !== 'function') {
		throw new TypeError('Iterator function `'+ iteratorFunction +'` is not a function!');
	}
	var isAsync = iteratorFunction.isAsync;
	if (arguments.length > 1) {
		iteratorFunction = iteratorFunction.bind.apply(iteratorFunction, 
			[this].concat(Array.prototype.slice.call(arguments, 1))
		);
		iteratorFunction.isAsync = isAsync;
	}
	if (isAsync) {
		if (Symbol && Symbol.asyncIterator) {
			this[Symbol.asyncIterator] = iteratorFunction;
		}
		this[ASYNC_ITERATOR_ID] = iteratorFunction;
	} else {
		if (Symbol && Symbol.iterator) {
			this[Symbol.iterator] = iteratorFunction;
		}
		this[ITERATOR_ID] = iteratorFunction;
	}
}
exports.Iterable = Iterable; 

function __iter__(iterable, async) {
	var iterFunction, iter;
	if (async === true) {
		iterFunction = iterable[ASYNC_ITERATOR];
	} else if (async === false) {
		iterFunction = iterable[ITERATOR];
	} else {
		iterFunction = iterable[ITERATOR] || iterable[ASYNC_ITERATOR];
	}
	if (typeof iterFunction === 'function') {
		iter = iterFunction.call(iterable);
	}
	if (typeof iter !== 'object' || typeof iter.next !== 'function') {
		throw new TypeError("Could not get "+ (async ? "asynchronous" : "") +" iterator from  `"+
			iterable +"`!");
	} else {
		return iter;
	}
}

/** 
*/
Iterable.subclass = function subclass(constructor, members) {
	var parent = this;
	if (typeof constructor !== 'function') { // If no constructor is given ...
		constructor = (function () { // ... provide a default constructor.
			parent.apply(this, arguments);
		});
	}
	constructor.prototype = Object.create(parent.prototype);
	constructor.prototype.constructor = constructor;
	/** The constructor function's prototype is changed so static properties are inherited as
	well. */
	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(constructor, parent);
	} else {
		constructor.__proto__ = parent;
	}
	if (members) {
		for (var id in members) {
			constructor.prototype[id] = members[id];
		}
	}
	return constructor;
};

var SET_TYPE_IS_DEFINED = typeof Set === 'function',
	MAP_TYPE_IS_DEFINED = typeof Map === 'function';

function list(source) {
	if (Array.isArray(source)) {
		return Iterable.fromArray(source);
	} else if (typeof source === 'string') {
		return Iterable.fromString(source);
	} else if (SET_TYPE_IS_DEFINED && source instanceof Set) {
		return Iterable.fromSet(source);
	} else if (MAP_TYPE_IS_DEFINED && source instanceof Map) {
		return Iterable.fromMap(source);
	} else {
		return new Iterable(__iter__(source));
	}
}
exports.list = list;
