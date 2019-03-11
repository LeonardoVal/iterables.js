/**
*/

/**
*/
Iterable.emptyIterator = function emptyIterator() {
	return generatorIterator(function (obj) {
		obj.done = true;
	});
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
	var iter = __iter__(this);
	return then(iter.next(), function (head) {
		return head.done;
	});
};