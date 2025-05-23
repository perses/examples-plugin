import { ViewDashboard } from '@perses-dev/dashboards';

import { QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';
import { datasourceApi, queryClient } from '../persesApi';
import { muiTheme, chartsTheme } from '../persesApi';
import { ThemeProvider } from '@emotion/react';
import { PluginRegistry } from '@perses-dev/plugin-system';
import { ChartsProvider, ErrorAlert, ErrorBoundary } from '@perses-dev/components';
import { pluginLoader } from './PersesPluginRegistry';
import { sampleDashboard } from '../dashboard-sample';
import { Typography } from '@mui/material';

export default function PersesDashboardWrapper() {
  return (
    <>
      <h1>Plugin Embedding - Dashboard</h1>
      <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
        Below is an example of embedding a Perses dashboard in a React application.
      </Typography>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <ThemeProvider theme={muiTheme}>
              <ChartsProvider chartsTheme={chartsTheme}>
                <ErrorBoundary FallbackComponent={ErrorAlert}>
                  <PluginRegistry pluginLoader={pluginLoader}>
                    <ViewDashboard
                      dashboardResource={sampleDashboard}
                      datasourceApi={datasourceApi}
                      isReadonly={true}
                      isVariableEnabled={true}
                      isEditing={false}
                      isCreating={false}
                      isDatasourceEnabled={true}
                    />
                  </PluginRegistry>
                </ErrorBoundary>
              </ChartsProvider>
            </ThemeProvider>
          </QueryParamProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}
