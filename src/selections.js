/**
*/

/** `filter(filterFunction)` returns an iterable of this iterable elements for which `condition`
returns true.
*/
Iterable.filterIterator = function filterIterator(list, condition) {
	var iter = __iter__(list),
		i = -1,
		done = false;
	condition = condition || __toBool__;
	return {
		next: function next_filterIterator() {
			if (!done) do {
				i++;
				var x = iter.next();
				done = x.done;
				if (!done && condition(x.value, i, iter)) {
					return { value: x.value };
				}
			} while (!done);
			return { done: true };
		},
		return: function return_filterIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.filter = function filter(condition) {
	return new Iterable(Iterable.filterIterator, this, condition);
};

/** 
*/
Iterable.filterMapIterator = function filterMapIterator(list, condition, mapFunction) {
	var iter = __iter__(list),
		i = -1,
		done = false;
	condition = condition || __toBool__;
	return {
		next: function next_filterMapIterator() {
			if (!done) do {
				i++;
				var x = iter.next();
				done = x.done;
				if (!done && condition(x.value, i, iter)) {
					return { value: mapFunction(x.value, i, iter) };
				}
			} while (!done);
			return { done: true };
		},
		return: function return_filterMapIterator() {
			done = true;
			return { done: true };
		}
	};
};

/**
*/
Iterable.takeWhileIterator = function takeWhileIterator(list, condition) {
	var iter = __iter__(list),
		i = -1,
		done = false;
	condition = condition || __toBool__;
	return {
		next: function next_takeWhileIterator() {
			var x; 
			if (!done) {
				i++;
				x = iter.next();
				done = x.done && !condition(x.value, i, iter);
			}
			if (!done) {
				return { value: x.value };
			} else {
				return { done: true };
			}
		},
		return: function return_takeWhileIterator() {
			done = true;
			return { done: true };
		}
	};
};

/** `takeWhile(condition)` return an iterable with the first elements that verify the given
`condition`.
*/
Iterable.prototype.takeWhile = function takeWhile(condition) {
	return new Iterable(Iterable.takeWhileIterator, this, condition);
};

/** `take(n=1)` return an iterable with the first `n` elements of this one.
*/
Iterable.prototype.take = function take(n) {
	n = isNaN(n) ? 1 : n | 0;
	return new Iterable(Iterable.takeWhileIterator, this, function condition(_, i) {
		return i < n;
	});
};

/** `head(defaultValue)` returns the first element. If the sequence is empty it returns 
`defaultValue`, or raise an exception if none is given.
*/
Iterable.prototype.head = function head(defaultValue) {
	var x = __iter__(this).next();
	if (x.done) {
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	} else {
		return x.value;
	}
};

/** `dropWhile(condition)` returns an iterable with the same elements than this, except the
first ones that comply with the condition.
*/
Iterable.dropWhileIterator = function dropWhileIterator(list, condition) {
	var iter = __iter__(list),
		i = -1,
		done = false,
		finishedDroping = false;
	condition = condition || __toBool__;
	return {
		next: function next_dropWhileIterator() {
			var x;
			if (!finishedDroping) {
				while (!done) {
					i++;
					x = iter.next();
					done = x.done;
					if (!done && !condition(x.value, i, iter)) {
						break;
					}
				}
				finishedDroping = true;
				return done ? { done: true } : { value: x.value };
			} else {
				return done ? { done: true } : iter.next();
			}
		},
		return: function return_dropWhileIterator() {
			done = true;
			return { done: true };
		}
	};
};

Iterable.prototype.dropWhile = function dropWhile(condition) {
	return new Iterable(Iterable.dropWhileIterator, this, condition);
};

/** `drop(n=1)` returns an iterable with the same elements than this, except the first `n` ones.
*/
Iterable.prototype.drop = function drop(n) {
	n = isNaN(n) ? 1 : n | 0;
	return new Iterable(Iterable.dropWhileIterator, this, function condition(_, i) {
		return i < n;
	});
};

/** `tail()` returns an iterable with the same elements than this, except the first one.
*/
Iterable.prototype.tail = function tail() {
	return this.drop(1); //FIXME Should raise an error if this is empty.
};