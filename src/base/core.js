/** 
*/
var ITERATOR_ID = '__iter__',
	ITERATOR = Symbol && Symbol.iterator || ITERATOR_ID,
	ASYNC_ITERATOR_ID = '__aiter__',
	ASYNC_ITERATOR = Symbol && Symbol.asyncIterator || ASYNC_ITERATOR_ID;

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
