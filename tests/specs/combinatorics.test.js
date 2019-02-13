define(['list-utils', 'tests-common'], function (list_utils, test_common) { "use strict";
	var expectIterator = test_common.expectIterator,
		expectList = test_common.expectList;

	describe("Combinatorics:", function () {
		it("`Iterable.permutations` function", function () {
			expect(list_utils.Iterable.prototype.permutations).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([0,1,2]).permutations(0), []);
			expectList(fromArray([0,1,2]).permutations(1), [[0], [1], [2]]);
			expectList(fromArray([0,1,2]).permutations(2), 
				[[0,1], [1,0], [2,0], [0,2], [1,2], [2,1]]);
			expectList(fromArray([0,1,2]).permutations(3), 
				[[0,1,2], [1,0,2], [2,0,1], [0,2,1], [1,2,0], [2,1,0]]);
			expectList(fromArray([0,1,2]).permutations(4), []);
		});

		it("`Iterable.combinations` function", function () {
			expect(list_utils.Iterable.prototype.combinations).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([0,1,2]).combinations(0), []);
			expectList(fromArray([0,1,2]).combinations(1), [[0], [1], [2]]);
			expectList(fromArray([0,1,2]).combinations(2), [[0,1], [0,2], [1,2]]);
			expectList(fromArray([0,1,2]).combinations(3), [[0,1,2]]);
			expectList(fromArray([0,1,2]).combinations(4), []);
		});
	}); // describe "Empty lists:"
}); //// define
