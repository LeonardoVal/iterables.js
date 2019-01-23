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
	return {
		next: function next_rangeIterator() {
			var done = from > to,
				value = from;
			from += step;
			return done ? { done: true } : { value: value };
		},
		return: function return_rangeIterator() {
			from = to + 1;
			return { done: true };
		}
	};
};

Iterable.range = function range(from, to, step) {
	return new Iterable(Iterable.rangeIterator, from, to, step);
};

/*FIXME
Iterable.enumFromThenTo = function enumFromThenTo(from, then, to) {
	return Iterable.range(from, to, then - from);
};

Iterable.enumFromThen = function enumFromThen(from, then) {
	var to = from < then ? +Infinity : -Infinity,
		step = from < then ? +1 : -1;
	return Iterable.range(from, to, step);
};

Iterable.enumFrom = function enumFrom(from) {
	return Iterable.range(from, Infinity, 1);
}; */

/** `repeat(value, n=Infinity)` builds an iterable that repeats the given `value` `n` times (or
forever by default).
*/
Iterable.repeatIterator = function repeatIterator(value, n) {
	n = isNaN(n) ? Infinity : +n;
	var i = 0;
	return {
		next: function next_repeatIterator() {
			var done = i >= n;
			i++;
			return done ? { done: true } : { value: value };
		},
		return: function return_repeatIterator() {
			i = n;
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
	return {
		next: function next_iterateIterator() {
			i++;
			value = x;
			x = f(x);
			return i > n ? { done: true } : { value: value };
		},
		return: function return_iterateIterator() {
			i = n;
			return { done: true };
		}
	};
};

Iterable.iterate = function iterate(f, x, n) {
	return new Iterable(Iterable.iterateIterator, f, x, n);
};