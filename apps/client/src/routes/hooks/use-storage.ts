import { useState } from 'react';

export const save = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

export const load = (key: string) => {
  const value: unknown = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : undefined;
  } catch (e) {
    // TODO
    console.log(e);
  }
};

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState(() => load(key) ?? defaultValue);

  function handleValueChange(newValue: T) {
    setValue(newValue);
    save(key, newValue);
  }

  return [value, handleValueChange];
}
