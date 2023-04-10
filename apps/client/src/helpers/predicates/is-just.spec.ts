import { isJust } from './is-just';

describe('isJust', () => {
  it.each([1, 0, 'a', '', true, false, [1], [], { k: 'v' }, {}])(
    'should return true when the value is Just',
    (value) => {
      expect(isJust(value)).toBe(true);
    },
  );

  it.each([undefined, null])(
    'should return false when the value is Nothing',
    (value) => {
      expect(isJust(value)).toBe(false);
    },
  );
});
