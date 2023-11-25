export function utcDateString(date: Date) {
  return [
    date.getUTCFullYear(),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0'),
  ].join('-');
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('returns date string in UTC time', () => {
    const date = new Date('05 October 2011 14:48 UTC');

    expect(utcDateString(date)).toBe('2011-10-05');
  });
}
