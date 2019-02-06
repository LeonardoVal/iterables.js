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
		});
	}); // describe "Lists from arrays:"
}); //// define
