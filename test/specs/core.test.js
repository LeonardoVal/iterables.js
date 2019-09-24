define(['list-utils'], function (listUtils) { "use strict";
	describe("Core definitions:", function () {
		it("`Iterable` class", function () {
			let Iterable = listUtils.Iterable;
			expect(Iterable).toBeOfType('function');
			[
				'abc', [1,2,3], {x:1, y:2}
			].forEach((source) => {
				let iter = new listUtils.Iterable(source);
				expect(iter.source).toBe(source);
			});
		});
	}); // describe "Core definitions:"
}); //// define
