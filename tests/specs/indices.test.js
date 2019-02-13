define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists indices:", function () {
		it("`Iterable.indexOf` function", function () {
			var array = [7, 'a', false, null],
				arrayIterable = list_utils.Iterable.fromArray(array);
			array.forEach(function (value, index) {
				expect(arrayIterable.indexOf(value)).toBe(index);
				expect(arrayIterable.indexOf(value, index + 1)).toBeLessThan(0);
			});
			expect(arrayIterable.indexOf(33)).toBeLessThan(0);
		});

		it("`Iterable.indexWhere` function", function () {
			var array = [7, 'a', false, null],
				arrayIterable = list_utils.Iterable.fromArray(array);
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
