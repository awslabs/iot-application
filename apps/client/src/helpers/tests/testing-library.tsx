import { render as rtlRender } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { IntlProvider } from 'react-intl';

function render(ui: ReactElement, { locale = 'en', ...renderOptions } = {}) {
  function Wrapper(props: PropsWithChildren) {
    return <IntlProvider locale={locale}>{props.children}</IntlProvider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
