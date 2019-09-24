define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Empty lists:", function () {
		it("`EmptyIterable` class", function () {
			expect(listUtils.EmptyIterable).toBeOfType('function');
			expect(listUtils.EmptyIterable.prototype).toBeOfType(listUtils.Iterable);
			expectList(new listUtils.EmptyIterable(), []);
		});
	}); // describe "Empty lists:"
}); //// define
