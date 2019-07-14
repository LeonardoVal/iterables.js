define([], function () {
	function expectList(list, expectedList) {
		expect(list[Symbol.iterator]).toBeOfType('function');
		expect(list.length).toBe(expectedList.length);
		expectedList.forEach(function (expectedValue, index) {
			expect(list.get(index)).toEqual(expectedValue);
		});
		expect(list.get.bind(list, expectedList.length + 1)).toThrow();
		expect(list.get.bind(list, -1)).toThrow();
		expect(list.get(expectedList.length + 1, null)).toBe(null);
		expect(list.get(-1, '-1')).toBe('-1');
		expectIterator(list[Symbol.iterator](), expectedList);
	}

	function expectIterator(iterator, expectedList) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var x;
		for (var i = 0; i < expectedList.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toEqual(expectedList[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}

	function expectAsyncList(list, expectedList) {
		expect(list[Symbol.asyncIterator]).toBeOfType('function');
		var p = list.length();
		expect(p).toBeOfType(Promise);
		return p.then(function (value) {
			expect(value).toBe(expectedList.length);
		}).then(function () {
			var tests = expectedList.map(function (expectedValue, index) {
					return [[index], expectedValue];
				}).concat([
					[[expectedList.length + 1, null], null],
					[[-1, '-1'], '-1'],
					[[expectedList.length + 1]],
					[[-1]]
				]);
			return Promise.all(
				tests.map(function (test) {
					var p = list.get.apply(list, test[0]);
					expect(p).toBeOfType(Promise);
					return p.then(function (value) {
						if (test.length > 1) {
							expect(value).toEqual(test[1]);
						} else {
							fail("[list Iterable].get("+ test[0] +") should fail!");
						}
					}, function (reason) {
						if (test.length > 1) {
							fail("[list Iterable].get("+ test[0] +") should not fail!");
							throw reason;
						}
					});
				})
			);
		}).then(function () {
			return expectAsyncIterator(list[Symbol.asyncIterator](), expectedList);
		});
	}

	function expectAsyncIterator(iterator, expectedList) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var p = iterator.next(),
			i = 0,
			callback = function (x) {
				if (i < expectedList.length) {
					expect(x.done).toBeFalsy();
					expect(x.value).toEqual(expectedList[i]);
					i++;
					p = iterator.next();
					expect(p).toBeOfType(Promise);
					return p.then(callback);
				} else {
					expect(x.done).toBeTruthy();
					expect(x.value).not.toBeDefined();
					return x;
				}
			};
		expect(p).toBeOfType(Promise);
		return p.then(callback);
	}

	return {
		expectList: expectList,
		expectAsyncList: expectAsyncList,
		expectIterator: expectIterator,
		expectAsyncIterator: expectAsyncIterator
	};
});
