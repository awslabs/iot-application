import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import { colorBackgroundHomeHeader } from '@cloudscape-design/design-tokens';
import { BaseNavigationDetail } from '@cloudscape-design/components/internal/events';
import { Box } from '@cloudscape-design/components';
import ContentLayout from '@cloudscape-design/components/content-layout';
import { DevTool } from '@hookform/devtools';
import { useForm, Controller } from 'react-hook-form';
import { useIntl, FormattedMessage } from 'react-intl';
import type { FormatDateOptions } from 'react-intl';
import invariant from 'tiny-invariant';
import { useSetAtom } from 'jotai';

import { CREATE_DASHBOARD_HREF } from '~/constants';
import { DeleteDashboardModal } from './components/delete-dashboard-modal';
import { EmptyDashboardsTable } from './components/empty-dashboards-table';
import GettingStarted from './components/getting-started';
import Migration from './components/migration';
import { NoMatchDashboardsTable } from './components/no-matches-dashboards-table';
import { isJust } from '~/helpers/predicates/is-just';
import { useApplication } from '~/hooks/application/use-application';
import { useDashboardsQuery } from './hooks/use-dashboards-query';
import { useDeleteModalVisibility } from './hooks/use-delete-modal-visibility';
import { usePartialUpdateDashboardMutation } from './hooks/use-partial-update-dashboard-mutation';
import { useTablePreferences } from './hooks/use-table-preferences';
import { $Dashboard, DashboardSummary } from '~/services';
import { setDashboardEditMode } from '~/store/viewMode';

import './styles.css';
import { Features, featureEnabled } from '~/helpers/featureFlag/featureFlag';

const DateFormatOptions: FormatDateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export function DashboardsIndexPage() {
  const emitEditMode = useSetAtom(setDashboardEditMode);
  const intl = useIntl();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useDeleteModalVisibility();
  const updateDashboardMutation = usePartialUpdateDashboardMutation();

  const [preferences, setPreferences] = useTablePreferences();
  const dashboardsQuery = useDashboardsQuery();

  const {
    actions,
    collectionProps,
    filteredItemsCount = 0,
    items,
    paginationProps,
    propertyFilterProps,
  } = useCollection(dashboardsQuery.data ?? [], {
    propertyFiltering: {
      filteringProperties: [
        {
          key: 'id',
          propertyLabel: 'ID',
          groupValuesLabel: 'Dashboard IDs',
          operators: ['=', '!=', ':', '!:'],
        },
        {
          key: 'name',
          propertyLabel: 'Name',
          groupValuesLabel: 'Dashboard names',
          operators: ['=', '!=', ':', '!:'],
        },
        {
          key: 'description',
          propertyLabel: 'Description',
          groupValuesLabel: 'Dashboard descriptions',
          operators: ['=', '!=', ':', '!:'],
        },
      ],
      empty: <EmptyDashboardsTable />,
      noMatch: (
        <NoMatchDashboardsTable
          onClick={() =>
            actions.setPropertyFiltering({ tokens: [], operation: 'and' })
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {},
    sorting: {},
  });

  const paginationPropsWithAriaLabels = {
    ...paginationProps,
    ariaLabels: {
      nextPageLabel: 'Next page',
      paginationLabel: 'Dashboard Table pagination',
      previousPageLabel: 'Previous page',
      pageLabel: (pageNumber: number) => `Page ${pageNumber}`,
    },
  };

  const { selectedItems = [] } = collectionProps;

  const { navigate } = useApplication();

  const {
    control,
    formState: { errors },
    getValues,
    reset: resetForm,
  } = useForm({
    defaultValues: { name: '', description: '' },
    mode: 'onChange',
  });

  const handleViewDashboard = (selected?: DashboardSummary) => {
    if (selected?.id) {
      emitEditMode(false);
      navigate(`/dashboards/${selected.id}`);
    }
  };

  const handleEditDashboard = (selected?: DashboardSummary) => {
    if (selected?.id) {
      emitEditMode(true);
      navigate(`/dashboards/${selected.id}`);
    }
  };

  const handleOnFollow = (event: CustomEvent<BaseNavigationDetail>) => {
    event.preventDefault();

    invariant(isJust(event.detail.href), 'Expected href to be defined');

    emitEditMode(false);
    navigate(event.detail.href);
  };

  return (
    <ContentLayout
      header={
        <Box padding={{ top: 'xs' }}>
          <SpaceBetween size="m">
            <Header variant="h1">
              <FormattedMessage
                defaultMessage="Centurion Home"
                description="centurion home heading"
              />
            </Header>
          </SpaceBetween>
        </Box>
      }
    >
      <Box>
        <GettingStarted />
      </Box>
      {featureEnabled(Features.MIGRATION) && (
        <Box padding={{ top: 'l' }}>
          <Migration />
        </Box>
      )}
      <Box padding={{ top: 'l' }}>
        <Table
          {...collectionProps}
          variant="container"
          resizableColumns
          stickyHeader
          selectionType="multi"
          stripedRows={preferences.stripedRows}
          wrapLines={preferences.wrapLines}
          visibleColumns={preferences.visibleContent}
          loading={dashboardsQuery.isLoading}
          items={items}
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
            allItemsSelectionLabel: () =>
              intl.formatMessage({
                defaultMessage: 'Select dashboard checkbox',
                description: 'dashboards table selection checkbox label',
              }),
            cancelEditLabel: () =>
              intl.formatMessage({
                defaultMessage: 'Cancel table inline edit',
                description: 'dashboards table inline cancel edit label',
              }),
            submitEditLabel: () =>
              intl.formatMessage({
                defaultMessage: 'Submit table inline edit',
                description: 'dashboards table inline edit submit label',
              }),
            activateEditLabel: () =>
              intl.formatMessage({
                defaultMessage: 'Activate table inline edit',
                description: 'dashboards table inline edit activate label',
              }),
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
          onEditCancel={() => resetForm()}
          pagination={<Pagination {...paginationPropsWithAriaLabels} />}
          header={
            <Header
              variant="h1"
              description={intl.formatMessage({
                defaultMessage:
                  'Manage your dashboards or select one to begin monitoring your live industrial data.',
                description: 'dashboards table header description',
              })}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    disabled={selectedItems.length !== 1}
                    onClick={() => setIsDeleteModalVisible(true)}
                  >
                    <FormattedMessage
                      defaultMessage="Delete"
                      description="dashboards table header delete button"
                    />
                  </Button>

                  <Button
                    disabled={selectedItems.length !== 1}
                    onClick={() => handleViewDashboard(selectedItems[0])}
                  >
                    <FormattedMessage
                      defaultMessage="View"
                      description="dashboards table header view button"
                    />
                  </Button>

                  <Button
                    disabled={selectedItems.length !== 1}
                    onClick={() => handleEditDashboard(selectedItems[0])}
                  >
                    <FormattedMessage
                      defaultMessage="Build"
                      description="dashboards table header build button"
                    />
                  </Button>

                  <Button
                    data-testid={`table-create-dashboard`}
                    className="btn-custom-primary"
                    variant="primary"
                    onClick={() => navigate(CREATE_DASHBOARD_HREF)}
                  >
                    <span style={{ color: colorBackgroundHomeHeader }}>
                      <FormattedMessage
                        defaultMessage="Create"
                        description="dashboards table header create button"
                      />
                    </span>
                  </Button>
                </SpaceBetween>
              }
            >
              <FormattedMessage
                defaultMessage="Dashboards"
                description="dashboards table header heading"
              />
            </Header>
          }
          filter={
            // no props available for this in cloudscape to show full width
            <div className="dashboard-table-filter">
              <PropertyFilter
                {...propertyFilterProps}
                countText={intl.formatMessage(
                  {
                    defaultMessage: `
                {dashboardCount, plural,
                  zero {# matches}
                  one {# match}
                  other {# matches}}
                `,
                    description: 'dashboards table filter count text',
                  },
                  { dashboardCount: filteredItemsCount },
                )}
                filteringPlaceholder={intl.formatMessage({
                  defaultMessage: 'Find dashboards',
                  description: 'dashboards table filter placeholder',
                })}
                // TODO: internationalize fields
                filteringLoadingText="Loading suggestions"
                filteringErrorText="Error fetching suggestions."
                filteringRecoveryText="Retry"
                filteringFinishedText="End of results"
                filteringEmpty="No suggestions found"
                i18nStrings={{
                  filteringAriaLabel: 'your choice',
                  dismissAriaLabel: 'Dismiss',
                  filteringPlaceholder:
                    'Filter assets by text, property or value',
                  groupValuesText: 'Values',
                  groupPropertiesText: 'Properties',
                  operatorsText: 'Operators',
                  operationAndText: 'and',
                  operationOrText: 'or',
                  operatorLessText: 'Less than',
                  operatorLessOrEqualText: 'Less than or equal',
                  operatorGreaterText: 'Greater than',
                  operatorGreaterOrEqualText: 'Greater than or equal',
                  operatorContainsText: 'Contains',
                  operatorDoesNotContainText: 'Does not contain',
                  operatorEqualsText: 'Equals',
                  operatorDoesNotEqualText: 'Does not equal',
                  editTokenHeader: 'Edit filter',
                  propertyText: 'Property',
                  operatorText: 'Operator',
                  valueText: 'Value',
                  cancelActionText: 'Cancel',
                  applyActionText: 'Apply',
                  allPropertiesLabel: 'All properties',
                  tokenLimitShowMore: 'Show more',
                  tokenLimitShowFewer: 'Show fewer',
                  clearFiltersText: 'Clear filters',
                  removeTokenButtonAriaLabel: (token) =>
                    `Remove token ${token.propertyKey ?? '{token}'} ${
                      token.operator
                    } ${token.value as string}`,
                  enteredTextLabel: (text) => `Use: "${text}"`,
                }}
              />
            </div>
          }
          preferences={
            <CollectionPreferences
              title={intl.formatMessage({
                defaultMessage: 'Preferences',
                description: 'dashboards table preferences title',
              })}
              confirmLabel={intl.formatMessage({
                defaultMessage: 'Confirm',
                description: 'dashboards table preferences confirm',
              })}
              cancelLabel={intl.formatMessage({
                defaultMessage: 'Cancel',
                description: 'dashboards table preferences cancel',
              })}
              onConfirm={(event) => setPreferences(event.detail)}
              preferences={preferences}
              pageSizePreference={{
                title: intl.formatMessage({
                  defaultMessage: 'Select page size',
                  description: 'dashboards table preferences page size title',
                }),
                options: [
                  {
                    value: 10,
                    label: intl.formatMessage(
                      {
                        defaultMessage:
                          '{dashboardCount, plural, other {# dashboards}}',
                        description: 'dashboards table preferences 10 pages',
                      },
                      { dashboardCount: 10 },
                    ),
                  },
                  {
                    value: 25,
                    label: intl.formatMessage(
                      {
                        defaultMessage:
                          '{dashboardCount, plural, other {# dashboards}}',
                        description: 'dashboards table preferences 25 pages',
                      },
                      { dashboardCount: 25 },
                    ),
                  },
                  {
                    value: 100,
                    label: intl.formatMessage(
                      {
                        defaultMessage:
                          '{dashboardCount, plural, other {# dashboards}}',
                        description: 'dashboards table preferences 100 pages',
                      },
                      { dashboardCount: 100 },
                    ),
                  },
                ],
              }}
              wrapLinesPreference={{
                label: intl.formatMessage({
                  defaultMessage: 'Wrap lines',
                  description: 'dashboards table preferences wrap lines label',
                }),
                description: intl.formatMessage({
                  defaultMessage:
                    'Select to see all the text and wrap the lines',
                  description:
                    'dashboards table preferences wrap lines description',
                }),
              }}
              stripedRowsPreference={{
                label: intl.formatMessage({
                  defaultMessage: 'Striped rows',
                  description:
                    'dashboards table preferences striped rows label',
                }),
                description: intl.formatMessage({
                  defaultMessage: 'Select to add alternating shaded rows',
                  description:
                    'dashboards table preferences striped rows description',
                }),
              }}
              visibleContentPreference={{
                title: intl.formatMessage({
                  defaultMessage: 'Select visible content',
                  description:
                    'dashboards table preferences visible content title',
                }),
                options: [
                  {
                    label: intl.formatMessage({
                      defaultMessage: 'Dashboard properties',
                      description:
                        'dashboards table preferences visible content label',
                    }),
                    options: [
                      {
                        id: 'id',
                        label: intl.formatMessage({
                          defaultMessage: 'ID',
                          description:
                            'dashboards table preferences visible content id',
                        }),
                        editable: false,
                      },
                      {
                        id: 'name',
                        label: intl.formatMessage({
                          defaultMessage: 'Name',
                          description:
                            'dashboards table preferences visible content name',
                        }),
                      },
                      {
                        id: 'description',
                        label: intl.formatMessage({
                          defaultMessage: 'Description',
                          description:
                            'dashboards table preferences visible content description',
                        }),
                      },
                      {
                        id: 'lastUpdateDate',
                        label: intl.formatMessage({
                          defaultMessage: 'Last update date',
                          description:
                            'dashboards table preferences visible content last update date',
                        }),
                      },
                      {
                        id: 'creationDate',
                        label: intl.formatMessage({
                          defaultMessage: 'Creation date',
                          description:
                            'dashboards table preferences visible content creation date',
                        }),
                      },
                    ],
                  },
                ],
              }}
            />
          }
          columnDefinitions={[
            {
              id: 'id',
              header: intl.formatMessage({
                defaultMessage: 'ID',
                description: 'dashboards table ID column header',
              }),
              cell: (dashboard) => (
                <Link
                  href={`/dashboards/${dashboard.id}`}
                  onFollow={handleOnFollow}
                >
                  {dashboard.id}
                </Link>
              ),
              sortingField: 'id',
            },
            {
              id: 'name',
              header: intl.formatMessage({
                defaultMessage: 'Name',
                description: 'dashboards table name column header',
              }),
              cell: (dashboard) => dashboard.name,
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
                validation: () =>
                  isJust(errors.name) ? errors.name.message : '',
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
                  description:
                    'dashboard table description edit cell aria label',
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
              id: 'creationDate',
              header: intl.formatMessage({
                defaultMessage: 'Date created',
                description: 'dashboards table creation date column header',
              }),
              cell: (dashboard) =>
                intl.formatDate(dashboard.creationDate, DateFormatOptions),
              sortingField: 'creationDate',
            },
            {
              id: 'lastUpdateDate',
              header: intl.formatMessage({
                defaultMessage: 'Date modified',
                description: 'dashboards table last update date column header',
              }),
              cell: (dashboard) =>
                intl.formatDate(dashboard.lastUpdateDate, DateFormatOptions),
              sortingField: 'lastUpdateDate',
            },
          ]}
        />
      </Box>

      <DeleteDashboardModal
        dashboards={selectedItems}
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      />

      <DevTool control={control} />
    </ContentLayout>
  );
}
