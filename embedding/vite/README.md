# Embedding Perses Plugins in a React App

## Use case

You want to embed Perses dashboards or panels into your React application.

## Example Overview

This example demonstrates how to:
- Embed a full Perses dashboard
- Embed a single Perses panel
- Load multiple Perses plugins
- Use the required context providers and API setup

The example provides two views: a dashboard view and a single panel view. You can switch between them in the UI.

## 1. Install Dependencies

Install all required dependencies:

```bash
npm install
```

## 2. Project Structure

- `App.tsx`: Main entry, switches between dashboard and panel embedding.
- `components/PersesDashboardWrapper.tsx`: Embeds a full dashboard.
- `components/PersesPluginWrapper.tsx`: Embeds a single panel.
- `components/PersesPluginRegistry.tsx`: Loads all required plugins.
- `persesApi.ts`: Sets up the datasource API, query client, and themes.
- `dashboard-sample.ts`: Example dashboard resource.

## 3. Plugin Loader Setup

Create a plugin loader that includes all the plugins you want to support:

```tsx
// components/PersesPluginRegistry.tsx
import { dynamicImportPluginLoader } from '@perses-dev/plugin-system';
import * as prometheusPlugin from '@perses-dev/prometheus-plugin';
import * as timeseriesChartPlugin from '@perses-dev/timeseries-chart-plugin';
// ...import other plugins...

export const pluginLoader = dynamicImportPluginLoader([
  { resource: timeseriesChartPlugin.getPluginModule(), importPlugin: () => Promise.resolve(timeseriesChartPlugin) },
  { resource: prometheusPlugin.getPluginModule(), importPlugin: () => Promise.resolve(prometheusPlugin) },
  // ...add other plugins here...
]);
```

## 4. Embedding a Dashboard

```tsx
// components/PersesDashboardWrapper.tsx
import { ViewDashboard } from '@perses-dev/dashboards';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';
import { datasourceApi, queryClient, muiTheme, chartsTheme } from '../persesApi';
import { ThemeProvider } from '@emotion/react';
import { PluginRegistry } from '@perses-dev/plugin-system';
import { ChartsProvider, ErrorAlert, ErrorBoundary } from '@perses-dev/components';
import { pluginLoader } from './PersesPluginRegistry';
import { sampleDashboard } from '../dashboard-sample';

export function PersesDashboardWrapper() {
  return (
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
  );
}
```

## 5. Embedding a Single Panel

```tsx
// components/PersesPluginWrapper.tsx
import { ThemeProvider, Typography } from '@mui/material';
import { ChartsProvider } from '@perses-dev/components';
import { DurationString, PanelDefinition } from '@perses-dev/core';
import { DatasourceStoreProvider, Panel, VariableProvider } from '@perses-dev/dashboards';
import { DataQueriesProvider, PluginRegistry, TimeRangeProvider } from '@perses-dev/plugin-system';
import { QueryClientProvider } from '@tanstack/react-query';
import { chartsTheme, datasourceApi, muiTheme, queryClient } from '../persesApi';
import { pluginLoader } from './PersesPluginRegistry';

export function PersesPluginWrapper() {
  const persesTimeRange = { pastDuration: '1h' as DurationString };
  const queryDefinitions = [
    { kind: 'PrometheusTimeSeriesQuery', spec: { query: 'up' } },
  ];
  const panelDefinition: PanelDefinition = {
    kind: 'Panel',
    spec: {
      display: { name: 'Prometheus Query' },
      plugin: { kind: 'TimeSeriesChart', spec: {} },
    },
  };
  return (
    <ThemeProvider theme={muiTheme}>
      <ChartsProvider chartsTheme={chartsTheme}>
        <PluginRegistry pluginLoader={pluginLoader}>
          <QueryClientProvider client={queryClient}>
            <TimeRangeProvider timeRange={persesTimeRange}>
              <VariableProvider>
                <DatasourceStoreProvider datasourceApi={datasourceApi}>
                  <DataQueriesProvider definitions={queryDefinitions}>
                    <div style={{ width: '500px', height: '200px' }}>
                      <Panel definition={panelDefinition} />
                    </div>
                  </DataQueriesProvider>
                </DatasourceStoreProvider>
              </VariableProvider>
            </TimeRangeProvider>
          </QueryClientProvider>
        </PluginRegistry>
      </ChartsProvider>
    </ThemeProvider>
  );
}
```

## 6. Switching Between Views

The main `App.tsx` allows toggling between dashboard and panel embedding:

```tsx
import { useState } from 'react';
import { Header } from './Header';
import PersesDashboardWrapper from './components/PersesDashboardWrapper';
import { PersesPluginWrapper } from './components/PersesPluginWrapper';
import persesLogo from '/src/assets/perses.svg';

function App() {
  const [view, setView] = useState<'dashboard' | 'panel'>('dashboard');
  return (
    <>
      <Header logo={persesLogo} onNavigate={setView} />
      {view === 'dashboard' && <PersesDashboardWrapper />}
      {view === 'panel' && <PersesPluginWrapper />}
    </>
  );
}
export default App;
```

---

For more details, see the source files in this directory. This example demonstrates a robust approach to embedding Perses dashboards and panels with support for multiple plugins and modern React best practices.
