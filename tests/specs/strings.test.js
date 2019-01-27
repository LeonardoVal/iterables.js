define(['list-utils'], function (list_utils) { "use strict";
	function expectList(list) {
		expect(list.__iter__).toBeOfType('function');
		expectIterator.apply(null, 
			[list.__iter__()].concat(Array.prototype.slice.call(arguments, 1))
		);
	}

	function expectIterator(iterator) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var x;
		for (var i = 1; i < arguments.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toBe(arguments[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}	

	describe("Lists from strings:", function () {
		it("`Iterable.iteratorFromString` function", function () {
			expect(list_utils.Iterable.iteratorFromString).toBeOfType('function');
			var iteratorFromString = list_utils.Iterable.iteratorFromString.bind(list_utils.Iterable);
			expectIterator(iteratorFromString(""));
			expectIterator(iteratorFromString("a"), "a");
			expectIterator(iteratorFromString("ab"), "a", "b");
			expectIterator(iteratorFromString("abc"), "a", "b", "c");
		});

		it("`StringIterable` class", function () {
			expect(list_utils.StringIterable).toBeOfType('function');
			expectList(new list_utils.StringIterable(""));
			expectList(new list_utils.StringIterable("a"), "a");
			expectList(new list_utils.StringIterable("ab"), "a", "b");
			expectList(new list_utils.StringIterable("abc"), "a", "b", "c");
		});

		it("`Iterable.fromString` function", function () {
			expect(list_utils.Iterable.fromString).toBeOfType('function');
			var fromString = list_utils.Iterable.fromString.bind(list_utils.Iterable);
			expectList(fromString(""));
			expectList(fromString("a"), "a");
			expectList(fromString("ab"), "a", "b");
			expectList(fromString("abc"), "a", "b", "c");
		});

		it("`Iterable.join` function", function () {
			expect(list_utils.Iterable.prototype.join).toBeOfType('function');
			var fromString = list_utils.Iterable.fromString.bind(list_utils.Iterable);
			expect(fromString("").join()).toBe("");
			expect(fromString("").join(',')).toBe("");
			expect(fromString("a").join()).toBe("a");
			expect(fromString("a").join(',')).toBe("a");
			expect(fromString("ab").join()).toBe("ab");
			expect(fromString("ab").join(',')).toBe("a,b");
			expect(fromString("abc").join()).toBe("abc");
			expect(fromString("abc").join('|')).toBe("a|b|c");
		});
	}); // describe "Lists from arrays:"
}); //// define
