import { atom } from 'jotai';

/**
 * edit mode visibility store
 */
const isEditModeVisible = atom(false);

/**
 * Readonly edit mode visibility
 */
export const getDashboardEditMode = atom((get) => get(isEditModeVisible));

/** Set isEditModeVisible in store */
export const setDashboardEditMode = atom(
  null,
  (_get, set, isVisible: boolean) => {
    set(isEditModeVisible, isVisible);
  },
);
