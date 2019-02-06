define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Singletons lists:", function () {
		it("`Iterable.singletonIterator` function", function () {
			expect(list_utils.Iterable.singletonIterator).toBeOfType('function');
			expectIterator(list_utils.Iterable.singletonIterator(Math.PI), [Math.PI]);
			expectIterator(list_utils.Iterable.singletonIterator(), [undefined]);
		});

		it("`Iterable.singleton` function", function () {
			expect(list_utils.Iterable.singleton).toBeOfType('function');
			expect(list_utils.Iterable.singleton()).toBeOfType(list_utils.Iterable);
			expectList(list_utils.Iterable.singleton(Math.PI), [Math.PI]);
			expectList(list_utils.Iterable.singleton(), [undefined]);
		});
	}); // describe "Singletons lists:"
}); //// define
