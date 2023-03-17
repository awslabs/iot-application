import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { IntlProvider } from 'react-intl';

import '@cloudscape-design/global-styles/index.css';
import { router, queryClient } from './router';
import { DEFAULT_LOCALE } from './constants';

const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
});

const rootEl = document.getElementById('root');

/*
import { createDashboard } from './services';
const seedData = [
  {
    name: 'Alabama',
    description: 'AL',
  },
  {
    name: 'Alaska',
    description: 'AK',
  },
  {
    name: 'American Samoa',
    description: 'AS',
  },
  {
    name: 'Arizona',
    description: 'AZ',
  },
  {
    name: 'Arkansas',
    description: 'AR',
  },
  {
    name: 'California',
    description: 'CA',
  },
  {
    name: 'Colorado',
    description: 'CO',
  },
  {
    name: 'Connecticut',
    description: 'CT',
  },
  {
    name: 'Delaware',
    description: 'DE',
  },
  {
    name: 'District Of Columbia',
    description: 'DC',
  },
  {
    name: 'Federated States Of Micronesia',
    description: 'FM',
  },
  {
    name: 'Florida',
    description: 'FL',
  },
  {
    name: 'Georgia',
    description: 'GA',
  },
  {
    name: 'Guam',
    description: 'GU',
  },
  {
    name: 'Hawaii',
    description: 'HI',
  },
  {
    name: 'Idaho',
    description: 'ID',
  },
  {
    name: 'Illinois',
    description: 'IL',
  },
  {
    name: 'Indiana',
    description: 'IN',
  },
  {
    name: 'Iowa',
    description: 'IA',
  },
  {
    name: 'Kansas',
    description: 'KS',
  },
  {
    name: 'Kentucky',
    description: 'KY',
  },
  {
    name: 'Louisiana',
    description: 'LA',
  },
  {
    name: 'Maine',
    description: 'ME',
  },
  {
    name: 'Marshall Islands',
    description: 'MH',
  },
  {
    name: 'Maryland',
    description: 'MD',
  },
  {
    name: 'Massachusetts',
    description: 'MA',
  },
  {
    name: 'Michigan',
    description: 'MI',
  },
  {
    name: 'Minnesota',
    description: 'MN',
  },
  {
    name: 'Mississippi',
    description: 'MS',
  },
  {
    name: 'Missouri',
    description: 'MO',
  },
  {
    name: 'Montana',
    description: 'MT',
  },
  {
    name: 'Nebraska',
    description: 'NE',
  },
  {
    name: 'Nevada',
    description: 'NV',
  },
  {
    name: 'New Hampshire',
    description: 'NH',
  },
  {
    name: 'New Jersey',
    description: 'NJ',
  },
  {
    name: 'New Mexico',
    description: 'NM',
  },
  {
    name: 'New York',
    description: 'NY',
  },
  {
    name: 'North Carolina',
    description: 'NC',
  },
  {
    name: 'North Dakota',
    description: 'ND',
  },
  {
    name: 'Northern Mariana Islands',
    description: 'MP',
  },
  {
    name: 'Ohio',
    description: 'OH',
  },
  {
    name: 'Oklahoma',
    description: 'OK',
  },
  {
    name: 'Oregon',
    description: 'OR',
  },
  {
    name: 'Palau',
    description: 'PW',
  },
  {
    name: 'Pennsylvania',
    description: 'PA',
  },
  {
    name: 'Puerto Rico',
    description: 'PR',
  },
  {
    name: 'Rhode Island',
    description: 'RI',
  },
  {
    name: 'South Carolina',
    description: 'SC',
  },
  {
    name: 'South Dakota',
    description: 'SD',
  },
  {
    name: 'Tennessee',
    description: 'TN',
  },
  {
    name: 'Texas',
    description: 'TX',
  },
  {
    name: 'Utah',
    description: 'UT',
  },
  {
    name: 'Vermont',
    description: 'VT',
  },
  {
    name: 'Virgin Islands',
    description: 'VI',
  },
  {
    name: 'Virginia',
    description: 'VA',
  },
  {
    name: 'Washington',
    description: 'WA',
  },
  {
    name: 'West Virginia',
    description: 'WV',
  },
  {
    name: 'Wisconsin',
    description: 'WI',
  },
  {
    name: 'Wyoming',
    description: 'WY',
  },
];

function seedDashboard() {
  void Promise.all(
    seedData.map((seed) =>
      createDashboard({
        ...seed,
        definition: { widgets: [] },
        isFavorite: false,
      }),
    ),
  );
}

seedDashboard();
*/

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <IntlProvider locale="en" defaultLocale={DEFAULT_LOCALE}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </IntlProvider>
    </React.StrictMode>,
  );
}
