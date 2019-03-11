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
