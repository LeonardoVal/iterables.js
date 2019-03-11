/**
*/

/** `range(from=0, to, step=1)` builds an Iterable object with number from `from` upto `to` with
the given `step`. For example, `range(2,12,3)` represents the sequence `[2, 5, 8, 11]`.
*/
$builderMethod(function rangeIterator(from, to, step) {
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
	return generatorIterator(function (obj) {
		if (from >= to) {
			obj.done = true;
		} else {
			obj.value = from;
			from += step;
		}
	});
});

/** `enumFromThenTo(from=0, then=from+1, to=Infinity)` builds an Iterable object that goes over 
enumeration defined by the given values: `from` being the first one and `then` being the second one.
For example, `enumFromThenTo(1,3,8)` represents the sequence `[1,3,5,7]`.

The big difference with `range` is that the enumeration can go in either direction. For example,
`enumFromThenTo(10,7,0)` represents the sequence `[10,7,4,1]`.
*/
$builderMethod(function enumFromThenToIterator(from, then, to) {
	if (typeof from === 'undefined') {
		from = 0;
	}
	if (typeof then === 'undefined') {
		then = from + 1;
	}
	if (typeof to === 'undefined') {
		to = then > from ? +Infinity : -Infinity;
	}
	var step = then - from;
	return generatorIterator(function (obj) {
		if (step > 0 ? from > to : from < to) {
			obj.done = true;
		} else {
			obj.value = from;
			from += step;
		}
	});
});

Iterable.enumFromThen = function enumFromThen(from, then) {
	return Iterable.enumFromThenTo(from, then, then > from ? +Infinity : -Infinity);
};

Iterable.enumFrom = function enumFrom(from) {
	return Iterable.enumFromThenTo(from, from + 1, +Infinity);
};

/** `repeat(value, n=Infinity)` builds an iterable that repeats the given `value` `n` times (or
forever by default).
*/
$builderMethod(function repeatIterator(value, n) {
	n = isNaN(n) ? Infinity : +n;
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= n) {
			obj.done = true;
		} else {
			obj.value = value;
		}
	});
});

/** `iterate(f, x, n=Infinity)` returns an iterable that repeatedly applies the function `f` to
the value `x`, `n` times (or indefinitely by default).
*/
$builderMethod(function iterateIterator(f, x, n) {
	n = isNaN(n) ? Infinity : +n;
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= n) {
			obj.done = true;
		} else {
			obj.value = x;
			x = f(x);
		}
	});
});
