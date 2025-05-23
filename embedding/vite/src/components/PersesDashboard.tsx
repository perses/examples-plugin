import { ViewDashboard } from '@perses-dev/dashboards';

import { QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';
import { datasourceApi, queryClient } from '../persesApi';
import { PersesDashboardProvider } from './PersesDashboardWrapper';
import { sampleDashboard } from '../dashboard-sample';

export default function PersesDashboard() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <PersesDashboardProvider>
            <ViewDashboard
              dashboardResource={sampleDashboard}
              datasourceApi={datasourceApi}
              isReadonly={true}
              isVariableEnabled={true}
              isEditing={false}
              isCreating={false}
              isDatasourceEnabled={true}
            />
          </PersesDashboardProvider>
        </QueryParamProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
