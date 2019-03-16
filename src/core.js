/** 
*/
var ITERATOR_ID = '__iter__',
	ITERATOR = Symbol && Symbol.iterator || ITERATOR_ID,
	ASYNC_ITERATOR_ID = '__aiter__',
	ASYNC_ITERATOR = Symbol && Symbol.asyncIterator || ASYNC_ITERATOR_ID;

function Iterable(iteratorFunction) {
	if (typeof iteratorFunction !== 'function') {
		throw new TypeError('Iterator function is not a function!');
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

/** 
*/
Iterable.prototype.length = function length() {
	var result = 0;
	return lastFromIterator(filteredMapIterator(this, function () {
		return ++result;
	}), result);
};

/**
*/
Iterable.prototype.get = function get(index, defaultValue) {
	index = Math.floor(index);
	var hasDefault = arguments.length > 1,
		obj = filteredMapIterator(this, null, function (value, i) {
			return i === index;
		}).next();
	return then(obj, function (x) {
		if (x.done) {
			if (hasDefault) {
				return defaultValue;
			} else {
				throw new Error("Cannot get value at "+ index +"!");
			}
		} else {
			return x.value;
		}
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 */
function generatorIterator(nextFunction) {
	var done = false;
	return {
		next: function () {
			if (done) {
				return { done: true };
			} else {
				var obj = {};
				return then(nextFunction(obj), function () {
					done = obj.done;
					return obj;		
				});
			}
		},
		return: function () {
			done = true;
			return { done: true };
		}
	};
}
Iterable.generatorIterator = generatorIterator;

/**
 */
function generatorWithIndexIterator(nextFunction) {
	var i = -1;
	return generatorIterator(function (obj) {
		i++;
		return nextFunction(obj, i);
	});
}
Iterable.generatorWithIndexIterator = generatorWithIndexIterator;

/**
 */
function filteredMapIterator(list, valueFunction, checkFunction) {
	var iter = __iter__(list),
		i = -1;
	return generatorIterator(function (obj) {
		var x = iter.next();
		if (x instanceof Promise) {
			var asyncLoop = function filteredMapIterator_asyncLoop(p) {
				return p.then(function (x) {
					if (x.done) {
						obj.done = true;
						return obj;
					} else {
						i++;
						if (checkFunction && !checkFunction(x.value, i, iter)) {
							return asyncLoop(iter.next());
						} else {
							obj.value = valueFunction ? valueFunction(x.value, i, iter) : x.value;
							return obj;
						}
					}
				});
			};
			return asyncLoop(x);
		} else {
			i++;
			while (!x.done && checkFunction && !checkFunction(x.value, i, iter)) {
				x = iter.next();
				i++;
			}
			if (x.done) {
				obj.done = true;
			} else {
				obj.value = valueFunction ? valueFunction(x.value, i, iter) : x.value;
			}
		}
	});
}
Iterable.filteredMapIterator = filteredMapIterator;

/**
 */
function lastFromIterator(iterator, defaultValue) {
	var obj = iterator.next(),
		value = defaultValue,
		hasValue = arguments.length > 1;
	if (obj instanceof Promise) {
		var asyncFor = function (p) {
			return p.then(function (x) {
				if (x.done) {
					if (hasValue) {
						return value;
					} else {
						throw new Error("Attempted to get the last value of an empty iterator!");
					}
				} else {
					value = x.value;
					hasValue = true;
					return asyncFor(iterator.next());
				}
			});
		};
		return asyncFor(obj);
	} else {
		for (; !obj.done; obj = iterator.next()){
			value = obj.value;
			hasValue = true;
		}
		if (hasValue) {
			return value;
		} else {
			throw new Error("Attempted to get the last value of an empty iterator!");
		}
	}
}
Iterable.lastFromIterator = lastFromIterator;

Iterable.prototype.lastValue = function lastValue() {
	return lastFromIterator(__iter__(this));
};