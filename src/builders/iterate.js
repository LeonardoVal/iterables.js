/** `iterate(f, x, n=Infinity)` returns an iterable that repeatedly applies the function `f` to
the value `x`, `n` times (or indefinitely by default).
*/
$builderMethod(function iterateIterator(f, initial, n) {
	n = isNaN(n) ? Infinity : +n;
	var args = initial || [];
	return generatorWithIndexIterator(function (obj, i) {
		if (i >= n) {
			obj.done = true;
		} else if (i < args.length) {
			obj.value = args[i];
		} else {
			var x = f.apply(null, args);
			args.shift();
			args.push(x);
			obj.value = x;
		}
	});
});
