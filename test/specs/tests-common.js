/* globals fail */
// eslint-disable-next-line import/no-amd
function equality(value1, value2) {
  return value1 === value2 || JSON.stringify(value1) === JSON.stringify(value2);
}

export function expectIterator(iterator, expectedList) {
  expect(iterator.next).toBeOfType('function');
  expect(iterator.return).toBeOfType('function');
  let x;
  for (let i = 0; i < expectedList.length; i += 1) {
    x = iterator.next();
    expect(x.done).toBeFalsy();
    expect(x.value).toEqual(expectedList[i]);
  }
  x = iterator.next();
  expect(x.done).toBeTruthy();
  expect(x.value).not.toBeDefined();
}

export function expectList(list, expectedList) {
  expect(list.length).toBe(expectedList.length);
  expect(list.isEmpty()).toBe(expectedList.length === 0);

  expectedList.forEach((expectedValue, index) => {
    expect(list.get(index)).toEqual(expectedValue);
    expect(list.has(expectedValue, equality)).toBe(true);
    const equalToExpectedValue = equality.bind(null, expectedValue);
    let i = list.indexWhere(equalToExpectedValue);
    expect(i).not.toBeLessThan(0);
    expect(equality(list.get(i), expectedValue)).toBe(true);
    let is = list.indicesWhere(equalToExpectedValue);
    expect(is.indexOf(index)).not.toBeLessThan(0);

    if (typeof expectedValue !== 'object') {
      expect(list.has(expectedValue)).toBe(true);
      i = list.indexOf(expectedValue);
      expect(i).not.toBeLessThan(0);
      expect(list.get(i)).toEqual(expectedValue);
      is = list.indicesOf(expectedValue);
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

export function expectAsyncIterator(iterator, expectedList) {
  expect(iterator.next).toBeOfType('function');
  expect(iterator.return).toBeOfType('function');
  let p = iterator.next();
  let i = 0;
  const callback = (x) => {
    if (i < expectedList.length) {
      expect(x.done).toBeFalsy();
      expect(x.value).toEqual(expectedList[i]);
      i += 1;
      p = iterator.next();
      expect(p).toBeOfType(Promise);
      return p.then(callback);
    }
    expect(x.done).toBeTruthy();
    expect(x.value).not.toBeDefined();
    return x;
  };
  expect(p).toBeOfType(Promise);
  return p.then(callback);
}

export function expectAsyncList(list, expectedList) {
  expect(list[Symbol.asyncIterator]).toBeOfType('function');
  const p = list.length();
  expect(p).toBeOfType(Promise);
  return p.then((value) => {
    expect(value).toBe(expectedList.length);
  }).then(() => {
    const tests = expectedList.map(
      (expectedValue, index) => [[index], expectedValue],
    ).concat([
      [[expectedList.length + 1, null], null],
      [[-1, '-1'], '-1'],
      [[expectedList.length + 1]],
      [[-1]],
    ]);
    return Promise.all(
      tests.map((test) => {
        const p1 = list.get(...test[0]);
        expect(p1).toBeOfType(Promise);
        return p1.then((value) => {
          if (test.length > 1) {
            expect(value).toEqual(test[1]);
          } else {
            fail(`[list Iterable].get(${test[0]}) should fail!`);
          }
        }, (reason) => {
          if (test.length > 1) {
            fail(`[list Iterable].get(${test[0]}) should not fail!`);
            throw reason;
          }
        });
      }),
    );
  }).then(
    () => expectAsyncIterator(list[Symbol.asyncIterator](), expectedList),
  );
}

export default {
  expectList,
  expectAsyncList,
  expectIterator,
  expectAsyncIterator,
};
