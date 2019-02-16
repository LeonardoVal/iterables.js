define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Lists of tuples:", function () {
		it("zip()", function () {
			var Iterable = list_utils.Iterable;
			expect(Iterable.prototype.zip).toBeOfType('function');
			expect(Iterable.zip).toBeOfType('function');
			var fromString = Iterable.fromString.bind(Iterable);
			[{ 
				lists: [fromString('abc'), fromString('xyz')], 
				expectedResult: [['a','x'], ['b','y'], ['c','z']]
			 }, {
				lists: [fromString('abc'), fromString('x')], 
				expectedResult: [['a','x']]
			 }, {
				lists: [fromString('a'), fromString('xyz')], 
				expectedResult: [['a','x']]
			 }, {
				lists: [fromString(''), fromString('xyz')], 
				expectedResult: []
			 }, {
				lists: [fromString('abc'), fromString('')], 
				expectedResult: []
			 }].forEach(function (test) {
				var lists = test.lists;
				expectList(Iterable.prototype.zip.apply(lists[0], lists.slice(1)), test.expectedResult);
				expectList(Iterable.zip.apply(Iterable, lists), test.expectedResult); 
			});
		});

		it("product()", function () {
			var Iterable = list_utils.Iterable;
			expect(Iterable.prototype.product).toBeOfType('function');
			expect(Iterable.product).toBeOfType('function');
			[{	lists: ['ab', 'xy'],
				expectedResult: [['a','x'],['a','y'],['b','x'],['b','y']]
			 }, { lists: ['ab', 'x'],
			 	expectedResult: [['a','x'],['b','x']]
			 }, { lists: ['a', 'xy'],
				expectedResult: [['a','x'],['a','y']]
			 }, { lists: ['ab', ''],
				expectedResult: []
			 }, { lists: ['', 'xy'],
				expectedResult: []
			 }].forEach(function (test) {
				var lists = test.lists;
				expectList(Iterable.prototype.product.apply(lists[0], lists.slice(1)), test.expectedResult);
				expectList(Iterable.product.apply(Iterable, lists), test.expectedResult);
			});
		});
	}); // describe "Empty lists:"
}); //// define
