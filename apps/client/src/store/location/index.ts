import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';

/* Current window location state */
const locationBaseAtom = atomWithLocation();

/* Current window location */
export const locationAtom = atom((get) => get(locationBaseAtom));

/* Current location pathname */
export const pathnameAtom = atom((get) => get(locationAtom).pathname);
