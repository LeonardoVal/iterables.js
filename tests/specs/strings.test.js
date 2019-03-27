define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists from strings:", function () {
		it("`Iterable.stringIterator` function", function () {
			expect(list_utils.Iterable.fromStringIterator).toBeOfType('function');
			var stringIterator = list_utils.Iterable.fromStringIterator.bind(list_utils.Iterable);
			expectIterator(stringIterator(""), []);
			expectIterator(stringIterator("a"), ["a"]);
			expectIterator(stringIterator("ab"), ["a", "b"]);
			expectIterator(stringIterator("abc"), ["a", "b", "c"]);
		});

		it("`StringIterable` class", function () {
			expect(list_utils.FromStringIterable).toBeOfType('function');
			expectList(new list_utils.FromStringIterable(""), []);
			expectList(new list_utils.FromStringIterable("a"), ["a"]);
			expectList(new list_utils.FromStringIterable("ab"), ["a", "b"]);
			expectList(new list_utils.FromStringIterable("abc"), ["a", "b", "c"]);
		});

		it("`Iterable.fromString` function", function () {
			expect(list_utils.Iterable.fromString).toBeOfType('function');
			var fromString = list_utils.Iterable.fromString.bind(list_utils.Iterable);
			expectList(fromString(""), []);
			expectList(fromString("a"), ["a"]);
			expectList(fromString("ab"), ["a", "b"]);
			expectList(fromString("abc"), ["a", "b", "c"]);
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
