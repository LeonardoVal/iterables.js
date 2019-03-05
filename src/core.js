/** 
*/
var ITERATOR_ID = '__iter__',
	ITERATOR = Symbol && Symbol.iterator || ITERATOR_ID,
	ASYNC_ITERATOR_ID = '__aiter__',
	ASYNC_ITERATOR = Symbol && Symbol.asyncIterator || ASYNC_ITERATOR_ID,
	IS_ASYNC_ID = 'isAsync';

function Iterable(iteratorFunction) {
	if (typeof iteratorFunction !== 'function') {
		throw new TypeError('Iterator function is not a function!');
	}
	var isAsync = iteratorFunction[IS_ASYNC_ID];
	iteratorFunction = iteratorFunction.bind.apply(iteratorFunction, 
		[this].concat(Array.prototype.slice.call(arguments, 1))
	);
	iteratorFunction[IS_ASYNC_ID] = isAsync;
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
	var symbol = async ? ASYNC_ITERATOR : ITERATOR,
		iterFunction = iterable[symbol],
		iter;
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

/** 
*/
Iterable.prototype.length = function length() {
	var result = 0,
		p = this.forEach(function () {
			result++;
		});
	return !this.isAsync() ? result :
		p.then(function () {
			return result;
		});
};

/**
*/
Iterable.prototype.get = function get(index, defaultValue) {
	index = Math.floor(index);
	var found = false,
		hasDefaultValue = arguments.length < 2,
		result = defaultValue,
		p;
	if (!isNaN(index)) {
		p = this.forEach(function (value, i, iter) {
			if (i === index) {
				result = value;
				found = true;
				iter.return(); // Abort the iteration.
			}
		});
	}
	if (this.isAsync()) {
		if (!p) {
			return !hasDefaultValue ? Promise.resolve(defaultValue) :
				Promise.reject(new Error("Cannot get value at "+ index +"!"));
		} else {
			return p.then(function () {
				if (!found && hasDefaultValue) {
					throw new Error("Cannot get value at "+ index +"!");
				}
				return result;
			});
		}
	} else if (!found && hasDefaultValue) {
		throw new Error("Cannot get value at "+ index +"!");
	} else {
		return result;
	}
};

/** `forEach(doFunction, ifFunction)` applies `doFunction` to all elements complying with
`ifFunction`, and returns the last result. If no `ifFunction` is given, it iterates through all
the elements in the sequence. Both functions get the current value and position as arguments.

Asynchronous iterables are supported, but `doFunction` and `ifFunction` callbacks are assumed to be
synchronous.
*/
Iterable.prototype.forEach = function forEach(doFunction, ifFunction) {
	var isAsync = this.isAsync(),
		iter = __iter__(this, isAsync), 
		i = 0,
		current = iter.next(),
		result;
	if (isAsync) {
		if (!current.then) {
			throw new TypeError("List is supposed to be asynchronous, but next() returned `"+
				current +"` instead of a Promise!");
		}
		var asyncForEach = function asyncForEach(x) {
			if (x.done) {
				return result; // Return last value when done.
			} else {
				if (!ifFunction || ifFunction(current.value, i, iter)) {
					result = doFunction(x.value, i, iter);
				}
				i++;
				return iter.next().then(asyncForEach);
			}
		};
		return current.then(asyncForEach);
	} else {
		result = current.value;
		while (!current.done) {
			if (!ifFunction || ifFunction(current.value, i, iter)) {
				result = doFunction(current.value, i, iter);
			}
			current = iter.next();
			i++;
		}
		return result;
	}
};