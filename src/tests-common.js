define([], function () {
	function equality(value1, value2) {
		return value1 === value2 || 
			JSON.stringify(value1) === JSON.stringify(value2);
	}

	function expectList(list, expectedList) {
		expect(list.length).toBe(expectedList.length);
		expect(list.isEmpty()).toBe(expectedList.length === 0);

		expectedList.forEach(function (expectedValue, index) {
			expect(list.get(index)).toEqual(expectedValue);
			expect(list.has(expectedValue, equality)).toBe(true);
			let equalToExpectedValue = equality.bind(null, expectedValue),
				i = list.indexWhere(equalToExpectedValue);
			expect(i).not.toBeLessThan(0);
			expect(equality(list.get(i), expectedValue)).toBe(true);
			let is = list.indicesWhere(equalToExpectedValue);
			expect(is.indexOf(index)).not.toBeLessThan(0);

			if (typeof expectedValue !== 'object') {
				expect(list.has(expectedValue)).toBe(true);
				let i = list.indexOf(expectedValue);
				expect(i).not.toBeLessThan(0);
				expect(list.get(i)).toEqual(expectedValue);
				let is = list.indicesOf(expectedValue);
				expect(is.indexOf(index)).not.toBeLessThan(0);
			}
		});
		expect(list.get.bind(list, expectedList.length + 1)).toThrow();
		expect(list.get.bind(list, -1)).toThrow();
		expect(list.get(expectedList.length + 1, null)).toBe(null);
		expect(list.get(-1, '-1')).toBe('-1');
		
		expect(list[Symbol.iterator]).toBeOfType('function');
		expectIterator(list[Symbol.iterator](), expectedList);
	}

	function expectIterator(iterator, expectedList) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		let x;
		for (let i = 0; i < expectedList.length; i++) {
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
		let p = list.length();
		expect(p).toBeOfType(Promise);
		return p.then(function (value) {
			expect(value).toBe(expectedList.length);
		}).then(function () {
			let tests = expectedList.map(function (expectedValue, index) {
					return [[index], expectedValue];
				}).concat([
					[[expectedList.length + 1, null], null],
					[[-1, '-1'], '-1'],
					[[expectedList.length + 1]],
					[[-1]]
				]);
			return Promise.all(
				tests.map(function (test) {
					let p = list.get.apply(list, test[0]);
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
		let p = iterator.next(),
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
