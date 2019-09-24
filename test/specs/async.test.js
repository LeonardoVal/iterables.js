define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectAsyncIterator = test_common.expectAsyncIterator,
		expectAsyncList = test_common.expectAsyncList,
		Iterable = list_utils.Iterable;

	describe("Asynchronous lists:", function () {
		xit("`Iterable.mockAsyncIterator` function", function (done) {
			expect(Iterable.mockAsyncIterator).toBeOfType('function');
			expectAsyncIterator(Iterable.mockAsyncIterator('abc'), ['a', 'b', 'c'])
			.then(function () {
				var mockAsyncList = new Iterable(Iterable.mockAsyncIterator, 'xyz');
				return expectAsyncList(mockAsyncList, ['x', 'y', 'z']);
			})
			.then(done, done);
		});
	}); // describe "Empty lists:"
}); //// define
