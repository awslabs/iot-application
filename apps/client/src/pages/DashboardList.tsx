import * as React from 'react';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import { Link } from 'react-router-dom';

const DashboardList: React.FC = () => {
  // TODO: Retrieve this from the dashboard api
  const dashboards = [
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 1</Link>
      ),
      name: 'Dashboard 1',
      id: '56c53d6e-a599-11ed-afa1-0242ac120002',
    },
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 2</Link>
      ),
      name: 'Dashboard 2',
      id: '56c54570-a599-11ed-afa1-0242ac120002',
    },
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 3</Link>
      ),
      name: 'Dashboard 3',
      id: '56c546f6-a599-11ed-afa1-0242ac120002',
    },
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 4</Link>
      ),
      name: 'Dashboard 4',
      id: '56c54886-a599-11ed-afa1-0242ac120002',
    },
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 5</Link>
      ),
      name: 'Dashboard 5',
      id: '56c549bc-a599-11ed-afa1-0242ac120002',
    },
    {
      link: (
        <Link to={'56c53d6e-a599-11ed-afa1-0242ac120002'}>Dashboard 6</Link>
      ),
      name: 'Dashboard 6',
      id: '56c54ad4-a599-11ed-afa1-0242ac120002',
    },
  ];

  return (
    <Table
      columnDefinitions={[
        {
          id: 'link',
          header: 'Dashboard',
          cell: (e) => e.link,
          sortingField: 'name',
        },
      ]}
      items={dashboards}
      header={<Header>Dashboards</Header>}
    />
  );
};

export default DashboardList;
