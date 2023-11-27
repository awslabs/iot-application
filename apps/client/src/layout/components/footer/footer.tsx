import { FormattedMessage } from 'react-intl';
import {
  colorBackgroundControlDefault,
  colorBackgroundLayoutToggleDefault,
  spaceScaledXs,
  spaceScaledS,
  spaceScaledL,
} from '@cloudscape-design/design-tokens';
import './footer.css';
import { useParams } from 'react-router-dom';

export const Footer = () => {
  const params = useParams();

  const footerStyle = {
    fontSize: spaceScaledS,
    color: colorBackgroundControlDefault,
    backgroundColor: colorBackgroundLayoutToggleDefault,
    padding: `${spaceScaledXs} ${spaceScaledL}`,
  };

  return (
    <footer
      style={footerStyle}
      id="app-footer"
      className="dashboard-footer-container"
      data-testid="footer-component"
      hidden={!!params.dashboardId}
    >
      <div data-testid="copy-right" className="dashboard-footer-right-content">
        <FormattedMessage
          defaultMessage="© 2023, Amazon Web Services, Inc. or its affiliates."
          description="Copyright description"
        />
      </div>
    </footer>
  );
};
