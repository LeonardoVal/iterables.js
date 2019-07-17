define(['list-utils', 'tests-common'], function (listUtils, test_common) { "use strict";
	var expectList = test_common.expectList;

	describe("Lists of tuples:", function () {
		it("zip()", function () {
			var Iterable = listUtils.Iterable;
			expect(Iterable.prototype.zip).toBeOfType('function');
			expect(Iterable.zip).toBeOfType('function');
			var fromString = Iterable.fromString.bind(Iterable),
				test = function (testCase) {
					var lists = testCase.lists;
					expectList(Iterable.prototype.zip.apply(lists[0], lists.slice(1)),
						testCase.expectedResult);
					expectList(Iterable.zip.apply(Iterable, lists),
						testCase.expectedResult); 
				};
			test({ 
				lists: [fromString('abc'), fromString('xyz')], 
				expectedResult: [['a','x'], ['b','y'], ['c','z']]
			});
			test({
				lists: [fromString('abc'), fromString('x')], 
				expectedResult: [['a','x']]
			});
			test({
				lists: [fromString('a'), fromString('xyz')], 
				expectedResult: [['a','x']]
			});
			test({
				lists: [fromString(''), fromString('xyz')], 
				expectedResult: []
			});
			test({
				lists: [fromString('abc'), fromString('')], 
				expectedResult: []
			});
		});

		it("zipWith()", function () {
			var Iterable = listUtils.Iterable;
			expect(Iterable.prototype.zipWith).toBeOfType('function');
			expect(Iterable.zipWith).toBeOfType('function');
			var fromString = Iterable.fromString.bind(Iterable),
				fromValues = Iterable.fromValues.bind(Iterable),
				test = function (testCase) {
					var func = testCase.func,
						lists = testCase.lists;
					expectList(
						new Iterable(lists[0]).zipWith(func, ...lists.slice(1)),
						testCase.expectedResult
					);
					expectList(Iterable.zipWith(func, ...lists), 
						testCase.expectedResult
					); 
				};
			test({
				func: function (vs) { return vs[0] + vs[1]; },
				lists: [fromString('abc'), fromString('xyz')], 
				expectedResult: ['ax', 'by', 'cz']
			});
			test({
				func: function (vs) { return (+vs[0]) + (+vs[1]); },
				lists: [fromString('123'), fromString('77')], 
				expectedResult: [8, 9]
			});
			test({
				func: function (vs) { return (+vs[0]) + (+vs[1]); },
				lists: [fromString('123'), fromString('')], 
				expectedResult: []
			});
			test({
				func: function (vs) { return [vs[2], vs[0], vs[1]]; },
				lists: [fromValues(1,2,3), fromString('abc'), fromValues(true,false,null)],
				expectedResult: [[true,1,'a'], [false,2,'b'], [null,3,'c']]
			});
		});

		it("product()", function () {
			var Iterable = listUtils.Iterable;
			expect(Iterable.prototype.product).toBeOfType('function');
			expect(Iterable.product).toBeOfType('function');
			var test = function (testCase) {
					var lists = testCase.lists;
					expectList(new Iterable(lists[0]).product(...lists.slice(1)),
						testCase.expectedResult);
					expectList(Iterable.product(...lists),
						testCase.expectedResult);
				};
			test({
				lists: ['ab', 'xy'],
				expectedResult: [['a','x'],['b','x'],['a','y'],['b','y']]
			});
			test({
				lists: ['ab', 'x'],
			 	expectedResult: [['a','x'],['b','x']]
			});
			test({
				lists: ['a', 'xy'],
				expectedResult: [['a','x'],['a','y']]
			});
			test({
				lists: ['ab', ''],
				expectedResult: []
			});
			test({
				lists: ['', 'xy'],
				expectedResult: []
			});
		});
	}); // describe "Empty lists:"
}); //// define
