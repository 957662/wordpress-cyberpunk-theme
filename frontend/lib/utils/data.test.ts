/**
 * Data utility tests
 */

import {
  unique,
  uniqueBy,
  groupBy,
  chunk,
  shuffle,
  sortBy,
  deepClone,
  get,
  set,
  pick,
  omit,
  randomString,
  uuid,
  capitalize,
  truncate,
  isEmpty,
  debounce,
} from './data';

describe('Data Utilities', () => {
  describe('array operations', () => {
    describe('unique', () => {
      it('should remove duplicates from array', () => {
        expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        expect(unique(['a', 'b', 'b', 'a'])).toEqual(['a', 'b']);
      });
    });

    describe('uniqueBy', () => {
      it('should remove duplicates by key', () => {
        const arr = [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 1, name: 'Alice' },
        ];
        expect(uniqueBy(arr, 'id')).toHaveLength(2);
      });
    });

    describe('groupBy', () => {
      it('should group array by key', () => {
        const arr = [
          { type: 'a', value: 1 },
          { type: 'b', value: 2 },
          { type: 'a', value: 3 },
        ];
        const grouped = groupBy(arr, (item) => item.type);
        expect(grouped.a).toHaveLength(2);
        expect(grouped.b).toHaveLength(1);
      });
    });

    describe('chunk', () => {
      it('should split array into chunks', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      });
    });

    describe('shuffle', () => {
      it('should shuffle array', () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffle(arr);
        expect(shuffled).toHaveLength(5);
        expect(shuffled).not.toEqual(arr);
        expect(shuffled.sort()).toEqual(arr.sort());
      });
    });

    describe('sortBy', () => {
      it('should sort array by key', () => {
        const arr = [
          { id: 3, name: 'Charlie' },
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ];
        const sorted = sortBy(arr, (item) => item.id);
        expect(sorted[0].id).toBe(1);
        expect(sorted[2].id).toBe(3);
      });
    });
  });

  describe('object operations', () => {
    describe('deepClone', () => {
      it('should deep clone object', () => {
        const obj = { a: 1, b: { c: 2 } };
        const cloned = deepClone(obj);
        expect(cloned).toEqual(obj);
        expect(cloned).not.toBe(obj);
        expect(cloned.b).not.toBe(obj.b);
      });
    });

    describe('get', () => {
      it('should get nested property', () => {
        const obj = { a: { b: { c: 1 } } };
        expect(get(obj, 'a.b.c')).toBe(1);
        expect(get(obj, 'a.b.d', 'default')).toBe('default');
      });
    });

    describe('set', () => {
      it('should set nested property', () => {
        const obj = { a: {} };
        set(obj, 'a.b.c', 1);
        expect(obj.a.b.c).toBe(1);
      });
    });

    describe('pick', () => {
      it('should pick specified keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
      });
    });

    describe('omit', () => {
      it('should omit specified keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
      });
    });
  });

  describe('string operations', () => {
    describe('randomString', () => {
      it('should generate random string', () => {
        const str = randomString(8);
        expect(str).toHaveLength(8);
        expect(typeof str).toBe('string');
      });
    });

    describe('uuid', () => {
      it('should generate UUID', () => {
        const id = uuid();
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
    });

    describe('capitalize', () => {
      it('should capitalize first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('HELLO')).toBe('HELLO');
        expect(capitalize('')).toBe('');
      });
    });

    describe('truncate', () => {
      it('should truncate string', () => {
        expect(truncate('Hello World', 5)).toBe('He...');
        expect(truncate('Hello', 10)).toBe('Hello');
      });
    });
  });

  describe('validation', () => {
    describe('isEmpty', () => {
      it('should check if value is empty', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty([1])).toBe(false);
        expect(isEmpty({ a: 1 })).toBe(false);
      });
    });
  });

  describe('function utilities', () => {
    describe('debounce', () => {
      jest.useFakeTimers();

      it('should debounce function calls', () => {
        const fn = jest.fn();
        const debouncedFn = debounce(fn, 300);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(300);

        expect(fn).toHaveBeenCalledTimes(1);
      });

      jest.useRealTimers();
    });
  });
});
