define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Empty lists:", function () {
		xit("`Iterable.emptyIterator` function", function () {
			expect(list_utils.Iterable.emptyIterator).toBeOfType('function');
			expectIterator(list_utils.Iterable.emptyIterator(), []);
		});

		xit("`EmptyIterable` class", function () {
			expect(list_utils.EmptyIterable).toBeOfType('function');
			expect(list_utils.EmptyIterable.prototype).toBeOfType(list_utils.Iterable);
			expectList(new list_utils.EmptyIterable(), []);
		});

		xit("`Iterable.EMPTY` singleton", function () {
			expect(list_utils.Iterable.EMPTY).toBeOfType(list_utils.EmptyIterable);
			expectList(list_utils.Iterable.EMPTY, []);
		});
	}); // describe "Empty lists:"
}); //// define
