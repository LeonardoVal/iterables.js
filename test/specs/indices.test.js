define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Lists indices:", function () {
		it("`Iterable.indexOf` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.prototype.indexOf).toBeOfType('function');
			var array = [7, 'a', false, null],
				arrayIterable = Iterable.fromArray(array);
			array.forEach(function (value, index) {
				expect(arrayIterable.indexOf(value)).toBe(index);
				expect(arrayIterable.indexOf(value, index + 1)).toBeLessThan(0);
			});
			expect(arrayIterable.indexOf(33)).toBeLessThan(0);
		});

		it("`Iterable.indicesOf` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.prototype.indicesOf).toBeOfType('function');
			var array = [0,1,2,3,2,4,1,0,1,3],
				arrayIterable = Iterable.fromArray(array);
			expectList(arrayIterable.indicesOf(0), [0,7]);
			expectList(arrayIterable.indicesOf(1), [1,6,8]);
			expectList(arrayIterable.indicesOf(1, 2), [6,8]);
			expectList(arrayIterable.indicesOf(1, 6), [6,8]);
			expectList(arrayIterable.indicesOf(1, 7), [8]);
			expectList(arrayIterable.indicesOf(1, 8), [8]);
			expectList(arrayIterable.indicesOf(1, 10), []);
			expectList(arrayIterable.indicesOf(2), [2,4]);
			expectList(arrayIterable.indicesOf(3), [3,9]);
			expectList(arrayIterable.indicesOf(4), [5]);
			expectList(arrayIterable.indicesOf(4, 2), [5]);
			expectList(arrayIterable.indicesOf(4, 6), []);
			expectList(arrayIterable.indicesOf(5), []);
		});

		it("`Iterable.indexWhere` function", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable.prototype.indexWhere).toBeOfType('function');
			var array = [7, 'a', false, null],
				arrayIterable = Iterable.fromArray(array);
			array.forEach(function (value, index) {
				expect(arrayIterable.indexWhere(function (v) {
					return typeof v === typeof value;
				})).toBe(index);
				expect(arrayIterable.indexWhere(function (v) {
					return typeof v === typeof value;
				}, index + 1)).toBeLessThan(0);
			});
			expect(arrayIterable.indexWhere(function () {
				return false;
			})).toBeLessThan(0);	
		});
	}); // describe "Lists indices:"
}); //// define
