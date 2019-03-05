/**
*/

/**
*/
Iterable.prototype.isAsync = function isAsync() {
	return !!this[ASYNC_ITERATOR];
};

/** 
*/
Iterable.asyncIteratorFunction = function asyncIteratorFunction(iteratorFunction) {
	iteratorFunction[IS_ASYNC_ID] = true;
	return iteratorFunction;
};
var asyncIteratorFunction = Iterable.asyncIteratorFunction;

/** A `mockAsyncIterator` asynchronously iterates over a synchronous iterable. Useful mostly for
testing purposes. 
*/
Iterable.mockAsyncIterator = asyncIteratorFunction(function mockAsyncIterator(list) {
	var iter = __iter__(list),
		done = false;
	return {
		next: function next_mockAsyncIterator() { 
			var x = done ? { done: true } : iter.next();
			done = !!x.done;
			return Promise.resolve(x);
		},
		return: function return_mockAsyncIterator() {
			done = true;
			return { done: true };
		}
	};
});

/**
*/
Iterable.trickleIterator = function trickleIterator(list, time) {
	time = Math.floor(time) || 0;
	var iter = __iter__(list),
		done = false;
	return {
		next: function next_trickleIterator() {
			var x;
			if (!done) {
				try {
					x = iter.next();
				} catch (err) {
					return Promise.reject(err);
				}
				done = x.done;
			}
			if (done) {
				return Promise.resolve({ done: true });
			} else {
				return new Promise(function executor(resolve, reject) { 
					setTimeout(resolve.bind(null, x), time);
				});
			}
		},
		return: function return_trickleIterator() {
			done = true;
			return Promise.resolve({ done: true });
		}
	};
};