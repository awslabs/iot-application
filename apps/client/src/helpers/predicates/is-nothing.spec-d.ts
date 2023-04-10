import { expectTypeOf } from 'vitest';
import { isNothing } from './is-nothing';
import type { Maybe, Just, Nothing } from '~/types';

describe('isNothing', () => {
  test('isNothing<T> widens to Maybe<T>', () => {
    expectTypeOf(isNothing<number>).guards.toMatchTypeOf<Maybe<number>>();
    expectTypeOf(isNothing<number>).guards.toMatchTypeOf<
      Just<number> | Nothing
    >();
  });
});
