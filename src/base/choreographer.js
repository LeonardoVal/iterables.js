/**
 */
function choreographerIterator(lists, stepFunction, initial) {
	//FIXME Support any iterable `lists`. 
	var iters = Array.apply(null, Array(lists.length)),
		xs = initial || Array.apply(null, Array(lists.length)),
		iteratorFunction = function choreographerIteratorFunction(obj) {
			var _continue = false,
				async;
			do {
				async = false;
				for (var i = 0, x; i < xs.length; i++) {
					x = xs[i];
					if (!x || x.reset) {
						iters[i] = __iter__(lists[i]);
						xs[i] = iters[i].next();
					} else if (x.next) {
						xs[i] = iters[i].next();
					}
					async = async || x instanceof Promise;
				}
				if (async) {
					return Promise.all(xs).then(function (resolved) {
						xs = resolved;
						return stepFunction(obj, xs) ? choreographerIteratorFunction(obj) : obj;
					});
				} else {
					_continue = stepFunction(obj, xs);
				}
			} while (_continue);
			return obj;
		};
	return generatorIterator(iteratorFunction);
}
