/**
*/

/** `range(from=0, to, step=1)` builds an Iterable object with number from `from` upto `to` with
the given `step`. For example, `range(2,12,3)` represents the sequence `[2, 5, 8, 11]`.
*/
Iterable.rangeIterator = function rangeIterator(from, to, step) {
	switch (arguments.length) {
		case 0: from = 0; to = 0; step = 1; break;
		case 1: to = from; from = 0; step = 1; break;
		case 2: step = 1; break;
	}
	var done = false;
	return {
		next: function next_rangeIterator() {
			done = done || from > to;
			var value = from;
			from += step;
			return done ? { done: true } : { value: value };
		},
		return: function return_rangeIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.range = function range(from, to, step) {
	return new Iterable(Iterable.rangeIterator, from, to, step);
};

/** `enumFromThenTo(from=0, then=from+1, to=Infinity)` builds an Iterable object that goes over 
enumeration defined by the given values: `from` being the first one and `then` being the second one.
For example, `enumFromThenTo(1,3,8)` represents the sequence `[1,3,5,7]`.

The big difference with `range` is that the enumeration can go in either direction. For example,
`enumFromThenTo(10,7,0)` represents the sequence `[10,7,4,1]`.
*/
Iterable.enumFromThenTo = function enumFromThenTo(from, then, to) {
	if (typeof from === 'undefined') {
		from = 0;
	}
	if (typeof then === 'undefined') {
		then = from + 1;
	}
	if (typeof to === 'undefined') {
		to = then > from ? +Infinity : -Infinity;
	}
	var step = then - from,
		done = false;
	return {
		next: function next_enumFromThenToIterator() {
			done = done || (step > 0 ? from > to : from < to);
			var value = from;
			from += step;
			return done ? { done: true } : { value: value };
		},
		return: function return_enumFromThenToIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.enumFromThen = function enumFromThen(from, then) {
	return Iterable.enumFromThenTo(from, then, then > from ? +Infinity : -Infinity);
};

Iterable.enumFrom = function enumFrom(from) {
	return Iterable.enumFromThenTo(from, from + 1, +Infinity);
};

/** `repeat(value, n=Infinity)` builds an iterable that repeats the given `value` `n` times (or
forever by default).
*/
Iterable.repeatIterator = function repeatIterator(value, n) {
	n = isNaN(n) ? Infinity : +n;
	var i = 0,
		done = false;
	return {
		next: function next_repeatIterator() {
			done = done || (i++) >= n;
			return done ? { done: true } : { value: value };
		},
		return: function return_repeatIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.repeat = function repeat(value, n) {
	return new Iterable(Iterable.repeatIterator, value, n);
};

/** `iterate(f, x, n=Infinity)` returns an iterable that repeatedly applies the function `f` to
the value `x`, `n` times (or indefinitely by default).
*/
Iterable.iterateIterator = function iterateIterator(f, x, n) {
	n = isNaN(n) ? Infinity : +n;
	var i = 0;
		done = false;
	return {
		next: function next_iterateIterator() {
			done = done || (i++) >= n;
			if (done) {
				return { done: true };
			} else {
				var value = x;
				x = f(x);
				return { value: value };
			}
		},
		return: function return_iterateIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.iterate = function iterate(f, x, n) {
	return new Iterable(Iterable.iterateIterator, f, x, n);
};