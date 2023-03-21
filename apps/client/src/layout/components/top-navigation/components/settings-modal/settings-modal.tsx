import Modal from '@cloudscape-design/components/modal';
import { useIntl } from 'react-intl';

import { useDensity } from './hooks/use-density';
import { useDensityToggle } from './hooks/use-density-toggle';
import { useResetDensityToggle } from './hooks/use-reset-density-toggle';
import { ContentDensityToggle } from './components/content-density-toggle';
import { SettingsModalFooter } from './components/settings-modal-footer';

import type { ContentDensity } from '~/types';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SettingsModal(props: SettingsModalProps) {
  const [density, setDensity] = useDensity();
  const [toggled, setToggled] = useDensityToggle(density);
  const intl = useIntl();

  useResetDensityToggle({
    density,
    setToggled,
    isVisible: props.isVisible,
  });

  function handleClose() {
    props.onClose();
  }

  function handleConfirm() {
    const newDensity: ContentDensity = toggled ? 'comfortable' : 'compact';

    setDensity(newDensity);
    handleClose();
  }

  return (
    <Modal
      closeAriaLabel={intl.formatMessage({
        defaultMessage: 'Close settings',
        description: 'settings modal close button aria label',
      })}
      visible={props.isVisible}
      onDismiss={props.onClose}
      header={intl.formatMessage({
        defaultMessage: 'Settings',
        description: 'settings modal header',
      })}
      footer={
        <SettingsModalFooter onCancel={handleClose} onConfirm={handleConfirm} />
      }
    >
      <ContentDensityToggle toggled={toggled} onToggle={setToggled} />
    </Modal>
  );
}
