import FormField from '@cloudscape-design/components/form-field';
import Toggle from '@cloudscape-design/components/toggle';
import { FormattedMessage, useIntl } from 'react-intl';

interface ContentDensityToggleProps {
  onToggle: (toggled: boolean) => void;
  toggled: boolean;
}

export function ContentDensityToggle(props: ContentDensityToggleProps) {
  const intl = useIntl();

  return (
    <FormField
      description={intl.formatMessage({
        defaultMessage:
          'Your content density setting will be stored by your browser.',
        description: 'content density toggle description',
      })}
      label={intl.formatMessage({
        defaultMessage: 'Select content density',
        description: 'content density toggle label',
      })}
    >
      <Toggle
        onChange={(event) => props.onToggle(event.detail.checked)}
        checked={props.toggled}
      >
        <FormattedMessage
          defaultMessage="Comfortable"
          description="content density toggle on"
        />
      </Toggle>
    </FormField>
  );
}
