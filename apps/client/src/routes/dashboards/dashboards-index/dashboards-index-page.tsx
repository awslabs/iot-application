import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import { useForm, Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';
import invariant from 'tiny-invariant';

import { DashboardsTableHeader } from './components/dashboards-table-header';
import { DeleteDashboardModal } from './components/delete-dashboard-modal';
import { useDashboardsTable } from './hooks/use-dashboards-table';
import { useDeleteModalVisibility } from './hooks/use-delete-modal-visibility';
import { usePartialUpdateDashboardMutation } from './hooks/use-partial-update-dashboard-mutation';
import { useApplication } from '~/hooks/application/use-application';
import { $Dashboard } from '~/services';

export function DashboardsIndexPage() {
  const intl = useIntl();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useDeleteModalVisibility();
  const updateDashboardMutation = usePartialUpdateDashboardMutation();
  const { selectedItems, tableProps } = useDashboardsTable();
  const { navigate } = useApplication();

  const {
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: { name: '', description: '' },
    mode: 'onChange',
  });

  return (
    <>
      <Table
        {...tableProps}
        trackBy={(dashboard) => dashboard.id}
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
        submitEdit={async (item, column) => {
          invariant(column.id, 'Expected column to be defined');
          invariant(
            column.id === 'name' || column.id === 'description',
            'Expected column to be name or description',
          );

          await updateDashboardMutation.mutateAsync({
            id: item.id,
            [column.id]: getValues(column.id),
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
              <Link
                href={`/dashboards/${dashboard.id}`}
                onFollow={(event) => {
                  event.preventDefault();

                  invariant(event.detail.href, 'Expected href to be defined');

                  navigate(event.detail.href);
                }}
              >
                {dashboard.name}
              </Link>
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
              validation: () => {
                return errors.name?.message;
              },
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
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: intl.formatMessage({
                        defaultMessage: 'Dashboard name is required.',
                        description: 'create dashboard form name required',
                      }),
                      maxLength: {
                        value: $Dashboard.properties.name.maxLength,
                        message: intl.formatMessage(
                          {
                            defaultMessage:
                              'Dashboard name must be {maxLength} characters or less.',
                            description:
                              'create dashboard form name max length',
                          },
                          { maxLength: $Dashboard.properties.name.maxLength },
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        placeholder={intl.formatMessage({
                          defaultMessage: 'Enter dashboard name',
                          description:
                            'dashboard table name edit cell placeholder',
                        })}
                        value={field.value === '' ? value : field.value}
                        onChange={(event) => {
                          field.onChange(event.detail.value);
                          setValue(event.detail.value);
                        }}
                      />
                    )}
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
              validation: () => {
                return errors.description?.message;
              },
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
                  <Controller
                    control={control}
                    name="description"
                    rules={{
                      required: intl.formatMessage({
                        defaultMessage: 'Dashboard description is required.',
                        description:
                          'create dashboard form description required',
                      }),
                      maxLength: {
                        value: $Dashboard.properties.description.maxLength,
                        message: intl.formatMessage(
                          {
                            defaultMessage:
                              'Dashboard description must be {maxLength} characters or less.',
                            description:
                              'create dashboard form description max length',
                          },
                          {
                            maxLength:
                              $Dashboard.properties.description.maxLength,
                          },
                        ),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        ariaRequired
                        autoFocus
                        placeholder={intl.formatMessage({
                          defaultMessage: 'Enter dashboard description',
                          description:
                            'dashboard table description edit cell placeholder',
                        })}
                        value={field.value === '' ? value : field.value}
                        onChange={(event) => {
                          field.onChange(event.detail.value);
                          setValue(event.detail.value);
                        }}
                      />
                    )}
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
