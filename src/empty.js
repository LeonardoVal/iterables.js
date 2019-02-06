/**
*/

/**
*/
Iterable.emptyIterator = function emptyIterator() {
	return { 
		next: function next_emptyIterator() {
			return { done: true };
		},
		return: function return_emptyIterator() {
			return { done: true };
		}
	};
};

exports.EmptyIterable = Iterable.subclass(function EmptyIterable() {
	Iterable.call(this, Iterable.emptyIterator);
}, {
	length: function length() {
		return 0;
	},
	get: function get(i, defaultValue) {
		if (arguments.length < 2) {
			throw new Error("Cannot get value at "+ i +"!");
		} else {
			return defaultValue;
		}
	}
});

/**
*/
Iterable.empty = function empty() {
	return new exports.EmptyIterable();
};

/**
*/
Iterable.EMPTY = Iterable.empty();

/** `isEmpty()` returns if the sequence has no elements.
*/
Iterable.prototype.isEmpty = function isEmpty() {
	return this[ITERATOR]().next().done;
};