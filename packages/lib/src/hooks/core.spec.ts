import type { DashboardsCoreClient } from '../dashboards/dashboards.client';
import { createUseCore } from './core';

const mockClient: DashboardsCoreClient = {
  list: jest.fn(),
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('useCore', () => {
  describe('createUseCore', () => {
    it('creates a useCore hook', () => {
      const useCore = createUseCore({ dashboards: mockClient });

      expect(useCore()).toMatchObject(
        expect.objectContaining({ dashboards: mockClient }),
      );
    });
  });
});
