import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import 'aws-sdk-client-mock-jest';

afterEach(() => {
  cleanup();
});
