define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Lists from arrays:", function () {
		it("`ArrayIterable` class", function () {
			let ArrayIterable = listUtils.ArrayIterable;
			expect(ArrayIterable).toBeOfType('function');
			expectList(new ArrayIterable([]), []);
			expectList(new ArrayIterable([true]), [true]);
			expectList(new ArrayIterable([1, 2]), [1, 2]);
			expectList(new ArrayIterable(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`Iterable.fromArray` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.fromArray).toBeOfType('function');
			var fromArray = Iterable.fromArray.bind(Iterable);
			expectList(fromArray([]), []);
			expectList(fromArray([true]), [true]);
			expectList(fromArray([1, 2]), [1, 2]);
			expectList(fromArray(['a', 'b', 'c']), ['a', 'b', 'c']);
		});

		it("`Iterable.fromValues` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.fromValues).toBeOfType('function');
			var fromValues = Iterable.fromValues.bind(Iterable);
			expectList(fromValues(), []);
			expectList(fromValues(true), [true]);
			expectList(fromValues(1, 2), [1, 2]);
			expectList(fromValues('a', 'b', 'c'), ['a', 'b', 'c']);
		});

		it("`Iterable.toArray` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.prototype.toArray).toBeOfType('function');
			var fromValues = Iterable.fromValues.bind(Iterable);
			expect(fromValues().toArray()).toEqual([]);
			expect(fromValues(true).toArray()).toEqual([true]);
			expect(fromValues(1, 2).toArray()).toEqual([1, 2]);
			expect(fromValues('a', 'b', 'c').toArray()).toEqual(['a', 'b', 'c']);
		});
	}); // describe "Lists from arrays:"
}); //// define
