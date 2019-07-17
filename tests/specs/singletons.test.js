define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Singletons lists:", function () {
		it("`Iterable.singleton` function", function () {
			expect(listUtils.SingletonIterable).toBeOfType('function');
			expectList(new listUtils.SingletonIterable(Math.PI), [Math.PI]);
			expectList(new listUtils.SingletonIterable(), [undefined]);
		});
	}); // describe "Singletons lists:"
}); //// define
