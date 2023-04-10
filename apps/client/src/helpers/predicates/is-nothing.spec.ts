import { isNothing } from './is-nothing';

describe('isNothing', () => {
  it.each([null, undefined])(
    'should return true when the value is Nothing',
    (value) => {
      expect(isNothing(value)).toBe(true);
    },
  );

  it.each([1, 0, 'a', '', true, false, [1], [], { k: 'v' }, {}])(
    'should return false when the value is Just',
    (value) => {
      expect(isNothing(value)).toBe(false);
    },
  );
});
