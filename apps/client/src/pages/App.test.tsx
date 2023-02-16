import createWrapper from '@cloudscape-design/components/test-utils/dom';
import renderRouter from '../testing/routes';

const CloudScapeWrapper = (path = '/') => {
  const { container } = renderRouter(path);

  const component = createWrapper(container);

  return { component };
};

test('renders content', () => {
  const { component } = CloudScapeWrapper();

  expect(
    component.findContentLayout()!.findHeader()!.getElement(),
  ).toHaveTextContent('IoT Application');
});

test('renders breadcrumbs', () => {
  const { component } = CloudScapeWrapper();

  expect(
    component.findBreadcrumbGroup()!.findBreadcrumbLink(1)!.getElement(),
  ).toHaveTextContent('Dashboards');
});

test('renders side navigation', () => {
  const { component } = CloudScapeWrapper();

  expect(
    component.findSideNavigation()!.findHeader()!.getElement(),
  ).toHaveTextContent('IoT Application');

  const link = component.findSideNavigation()!.findLinkByHref('/dashboards');

  expect(link!.getElement()).toHaveTextContent('Dashboards');
});
