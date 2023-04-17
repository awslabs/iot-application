import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import { useIntl } from 'react-intl';

import type { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';

interface DashboardsTablePreferencesProps {
  onConfirm: CollectionPreferencesProps['onConfirm'];
  preferences: CollectionPreferencesProps['preferences'];
}

export function DashboardsTablePreferences(
  props: DashboardsTablePreferencesProps,
) {
  const intl = useIntl();

  return (
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
      onConfirm={props.onConfirm}
      preferences={props.preferences}
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
          defaultMessage: 'Select to see all the text and wrap the lines',
          description: 'dashboards table preferences wrap lines description',
        }),
      }}
      stripedRowsPreference={{
        label: intl.formatMessage({
          defaultMessage: 'Striped rows',
          description: 'dashboards table preferences striped rows label',
        }),
        description: intl.formatMessage({
          defaultMessage: 'Select to add alternating shaded rows',
          description: 'dashboards table preferences striped rows description',
        }),
      }}
      visibleContentPreference={{
        title: intl.formatMessage({
          defaultMessage: 'Select visible content',
          description: 'dashboards table preferences visible content title',
        }),
        options: [
          {
            label: intl.formatMessage({
              defaultMessage: 'Dashboard properties',
              description: 'dashboards table preferences visible content label',
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
  );
}
