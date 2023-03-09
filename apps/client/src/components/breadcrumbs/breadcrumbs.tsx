import BreadcrumbGroup, {
  BreadcrumbGroupProps,
} from '@cloudscape-design/components/breadcrumb-group';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbsProps {
  crumbs: BreadcrumbGroupProps['items'];
}

export function useBreadcrumbs(crumbs: BreadcrumbsProps['crumbs']) {
  return {
    Breadcrumbs: () => <Breadcrumbs crumbs={crumbs} />,
  };
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <BreadcrumbGroup
      items={crumbs}
      onFollow={(event) => {
        event.preventDefault();
        navigate(event.detail.href);
      }}
    />
  );
}
