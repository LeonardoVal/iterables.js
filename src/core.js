/** 
*/
var ITERATOR = Symbol && Symbol.iterator || '__iter__';

var Iterable = exports.Iterable = function Iterable(iteratorFunction) {
	if (typeof iteratorFunction !== 'function') {
		throw new TypeError('Iterator function is not a function!');
	}
	iteratorFunction = iteratorFunction.bind
		.apply(iteratorFunction, [this].concat(Array.prototype.slice(arguments, 1)));
	if (Symbol && Symbol.iterator) {
		this[Symbol.iterator] = iteratorFunction;
	}
	this.__iter__ = iteratorFunction;
};

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

/** `forEach(doFunction, ifFunction)` applies `doFunction` to all elements complying with
`ifFunction`, and returns the last result. If no `ifFunction` is given, it iterates through all
the elements in the sequence. Both functions get the current value and position as arguments.
*/
Iterable.prototype.forEach = function forEach(doFunction, ifFunction) {
	var iter = this[ITERATOR](), 
		i = 0,
		current = iter.next(), 
		result = current.value;
	while (!current.done) {
		if (!ifFunction || ifFunction(current, i, iter)) {
			result = doFunction(current, i, iter);
		}
		current = iter.next();
		i++;
	}
	return result;
};

