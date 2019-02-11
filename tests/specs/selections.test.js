define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists selections:", function () {
		it("`Iterable.filterIterator` function", function () {
			expect(list_utils.Iterable.filterIterator).toBeOfType('function');
			var filterIterator = list_utils.Iterable.filterIterator.bind(list_utils.Iterable),
				fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectIterator(filterIterator(fromArray([false, true, false])), [true]);
			expectIterator(filterIterator(fromArray([0, 1, 2])), [1, 2]);
			expectIterator(filterIterator(fromArray(['', 'a', 'aa', 'aaa'])), ['a', 'aa', 'aaa']);
			expectIterator(filterIterator(fromArray(['', 0, null, false])), []);
			expectIterator(filterIterator(fromArray([0, 1, 2, 3, 4]), function (n) {
					return n % 2;
				}), [1, 3]);
			expectIterator(filterIterator(fromArray([0, 1, 2, 3, 4]), function (n) {
					return n > 2;
				}), [3, 4]);
			expectIterator(filterIterator(fromArray(['', 'a', 'aa', 'aaa']), function (x) {
					return x.length % 2;
				}), ['a', 'aaa']);
		});

		it("`Iterable.filter` function", function () {
			expect(list_utils.Iterable.prototype.filter).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([false, true, false]).filter(), [true]);
			expectList(fromArray([0, 1, 2]).filter(), [1, 2]);
			expectList(fromArray(['', 'a', 'aa', 'aaa']).filter(), ['a', 'aa', 'aaa']);
			expectList(fromArray(['', 0, null, false]).filter(), []);
			expectList(fromArray([0, 1, 2, 3, 4]).filter(function (n) {
					return n % 2;
				}), [1, 3]);
			expectList(fromArray([0, 1, 2, 3, 4]).filter(function (n) {
					return n > 2;
				}), [3, 4]);
			expectList(fromArray(['', 'a', 'aa', 'aaa']).filter(function (x) {
					return x.length % 2;
				}), ['a', 'aaa']);
		});
	}); // describe "Lists from arrays:"
}); //// define
