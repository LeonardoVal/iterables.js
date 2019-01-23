define(['list-utils'], function (list_utils) { "use strict";
	describe("Core definitions:", function () {
		it("`Iterable` class", function () {
			expect(list_utils.Iterable).toBeOfType('function');
			expect(function () { return new list_utils.Iterable(); }).toThrow();
			expect(function () { return new list_utils.Iterable([1,2,3]); }).toThrow();
		});

		//TODO Tests for `Iterable.subclass`.
	}); // describe "Core definitions:"
}); //// define
