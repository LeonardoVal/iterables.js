/** `cycle(n=Infinity)` returns an iterable that loops n times over the elements of this `Iterable`
 * (or forever by default).
 */
$methodOn1List(function cycleIterator(list, n) {
	n = isNaN(n) ? Infinity : +n;
	var iter = __iter__(list);
	return generatorIterator(function (obj) {
		var x = iter.next();
		if (x instanceof Promise) {
			var asyncLoop = function cycleIterator_asyncLoop(p) {
				return p.then(function (x) {
					if (x.done) {
						if (n > 0) {
							n--;
							iter = __iter__(list);
							return asyncLoop(iter.next());
						} else {
							obj.done = true;
							return obj;	
						}
					} else {
						obj.value = x.value;
						return obj;
					}
				});
			};
			return asyncLoop(x);
		} else {
			while (x.done && n > 0) {
				n--;
				iter = __iter__(list);
				x = iter.next();
			}
			if (x.done) {
				obj.done = true;
			} else {
				obj.value = x.value;
			}
			return obj;
		}
	});
});