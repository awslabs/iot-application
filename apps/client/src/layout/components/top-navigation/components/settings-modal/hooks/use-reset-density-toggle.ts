import { useEffect } from 'react';

import { isComfortable } from '../helpers/is-comfortable';
import type { ContentDensity } from '../../../../../../types';

export function useResetDensityToggle(props: {
  density: ContentDensity;
  isVisible: boolean;
  setToggled: (toggled: boolean) => void;
}) {
  function reset() {
    props.setToggled(isComfortable(props.density));
  }

  // reset toggle when modal is open/closed
  useEffect(reset, [props.isVisible]);
}
