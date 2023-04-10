import { expectTypeOf } from 'vitest';
import { isJust } from './is-just';
import type { Maybe, Just, Nothing } from '~/types';

describe('isJust', () => {
  test('isJust<T> widens to Maybe<T>', () => {
    expectTypeOf(isJust<number>).guards.toMatchTypeOf<Maybe<number>>();
    expectTypeOf(isJust<number>).guards.toMatchTypeOf<Just<number> | Nothing>();
  });
});
