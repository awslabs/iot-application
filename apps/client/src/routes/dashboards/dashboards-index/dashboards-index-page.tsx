import Input from '@cloudscape-design/components/input';
import Table from '@cloudscape-design/components/table';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useDashboardsTable } from './hooks/use-dashboards-table';
import { useDeleteModalVisibility } from './hooks/use-delete-modal-visibility';
import { usePartialUpdateDashboardMutation } from './hooks/use-partial-update-dashboard-mutation';
import { DashboardsTableHeader } from './components/dashboards-table-header';
import { DeleteDashboardModal } from './components/delete-dashboard-modal';

export function DashboardsIndexPage() {
  const intl = useIntl();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useDeleteModalVisibility();
  const updateDashboardMutation = usePartialUpdateDashboardMutation();
  const { selectedItems, tableProps } = useDashboardsTable();

  return (
    <>
      <Table
        {...tableProps}
        ariaLabels={{
          itemSelectionLabel: (_selectionState, row) =>
            intl.formatMessage(
              {
                defaultMessage: 'Select dashboard {name}',
                description: 'dashboards table selection group label',
              },
              { name: row.name },
            ),
        }}
        submitEdit={async (item, column, newValue) => {
          invariant(column.id, 'Expected column to be defined');

          await updateDashboardMutation.mutateAsync({
            id: item.id,
            [column.id]: newValue,
          });
        }}
        header={
          <DashboardsTableHeader
            isDeleteDisabled={selectedItems.length === 0}
            onClickDelete={() => setIsDeleteModalVisible(true)}
          />
        }
        columnDefinitions={[
          {
            id: 'dashboard-id',
            header: intl.formatMessage({
              defaultMessage: 'ID',
              description: 'dashboards table ID column header',
            }),
            cell: (dashboard) => dashboard.id,
            sortingField: 'dashboard-id',
          },
          {
            id: 'name',
            header: intl.formatMessage({
              defaultMessage: 'Name',
              description: 'dashboards table name column header',
            }),
            cell: (dashboard) => (
              <Link to={`/dashboards/${dashboard.id}`}>{dashboard.name}</Link>
            ),
            sortingField: 'name',
            editConfig: {
              ariaLabel: intl.formatMessage({
                defaultMessage: 'Name',
                description: 'dashboard table name edit cell aria label',
              }),
              editIconAriaLabel: intl.formatMessage({
                defaultMessage: 'Name Editable',
                description:
                  'dashboard table name edit cell edit icon aria label',
              }),
              errorIconAriaLabel: intl.formatMessage({
                defaultMessage: 'Name Error',
                description:
                  'dashboard table name edit cell error icon aria label',
              }),
              editingCell: (
                dashboard,
                {
                  currentValue,
                  setValue,
                }: {
                  currentValue?: string;
                  setValue: (name: string) => void;
                },
              ) => {
                const value = currentValue ?? dashboard.name;

                return (
                  <Input
                    autoFocus
                    placeholder={intl.formatMessage({
                      defaultMessage: 'Enter dashboard name',
                      description: 'dashboard table name edit cell placeholder',
                    })}
                    value={value}
                    onChange={(event) => setValue(event.detail.value)}
                  />
                );
              },
            },
          },
          {
            id: 'description',
            header: intl.formatMessage({
              defaultMessage: 'Description',
              description: 'dashboards table description column header',
            }),
            cell: (dashboard) => dashboard.description,
            sortingField: 'description',
            editConfig: {
              ariaLabel: intl.formatMessage({
                defaultMessage: 'Description',
                description: 'dashboard table description edit cell aria label',
              }),
              editIconAriaLabel: intl.formatMessage({
                defaultMessage: 'Description Editable',
                description:
                  'dashboard table description edit cell edit icon aria label',
              }),
              errorIconAriaLabel: intl.formatMessage({
                defaultMessage: 'Description Error',
                description:
                  'dashboard table description edit cell error icon aria label',
              }),
              editingCell: (
                dashboard,
                {
                  currentValue,
                  setValue,
                }: {
                  currentValue?: string;
                  setValue: (name: string) => void;
                },
              ) => {
                const value = currentValue ?? dashboard.description;

                return (
                  <Input
                    autoFocus
                    placeholder={intl.formatMessage({
                      defaultMessage: 'Enter dashboard description',
                      description:
                        'dashboard table description edit cell placeholder',
                    })}
                    value={value}
                    onChange={(event) => setValue(event.detail.value)}
                  />
                );
              },
            },
          },
          {
            id: 'lastUpdateDate',
            header: intl.formatMessage({
              defaultMessage: 'Last update date',
              description: 'dashboards table last update date column header',
            }),
            cell: (dashboard) => dashboard.lastUpdateDate,
            sortingField: 'lastUpdateDate',
          },
          {
            id: 'creationDate',
            header: intl.formatMessage({
              defaultMessage: 'Creation date',
              description: 'dashboards table creation date column header',
            }),
            cell: (dashboard) => dashboard.creationDate,
            sortingField: 'creationDate',
          },
        ]}
      />

      <DeleteDashboardModal
        dashboards={selectedItems}
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      />
    </>
  );
}
