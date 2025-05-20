# Embedding

# Use case

You want to embed a Perses plugin into your react app.

# Example

For the example we will use the time series chart plugin consuming data from a prometheus API using the Perses prometheus plugin.

1. Install Perses required dependencies and Perses plugins

```bash
npm install @perses-dev/plugin-system @perses-dev/prometheus-plugin @perses-dev/timeseries-chart-plugin
```

2. Install required peer dependencies

```bash
npm install react-router-dom react-hook-form @tanstack/react-query use-query-params @mui/material @emotion/react @emotion/styled @hookform/resolvers@^3.2.1
```

3. Create a PersesWrapper component that will initialize the required Context Providers, load the plugins and render the panel.

```tsx
import { ThemeProvider } from '@mui/material';
import { ChartsProvider, generateChartsTheme, getTheme } from '@perses-dev/components';
import { Datasource, DurationString, PanelDefinition } from '@perses-dev/core';
import { DatasourceApi, DatasourceStoreProvider, Panel, VariableProvider } from '@perses-dev/dashboards';
import {
  DataQueriesProvider,
  dynamicImportPluginLoader,
  PluginRegistry,
  TimeRangeProvider,
} from '@perses-dev/plugin-system';
import * as prometheusPlugin from '@perses-dev/prometheus-plugin';
import * as timeseriesChartPlugin from '@perses-dev/timeseries-chart-plugin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const pluginLoader = dynamicImportPluginLoader([
  {
    resource: timeseriesChartPlugin.getPluginModule(),
    importPlugin: () => Promise.resolve(timeseriesChartPlugin),
  },
  {
    resource: prometheusPlugin.getPluginModule(),
    importPlugin: () => Promise.resolve(prometheusPlugin),
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const globalDatasource: Datasource = {
  kind: 'GlobalDatasource',
  metadata: {
    name: 'prometheus',
  },
  spec: {
    default: true,
    plugin: {
      kind: 'PrometheusDatasource',
      spec: {
        directUrl: 'https://prometheus.demo.prometheus.io',
      },
    },
  },
};

const datasourceApi: DatasourceApi = {
  buildProxyUrl: () => '',
  getGlobalDatasource: () => Promise.resolve(globalDatasource),
  listGlobalDatasources: () => Promise.resolve([]),
  listDatasources: () => Promise.resolve([]),
  getDatasource: async () => Promise.resolve(undefined),
};

export function PersesWrapper() {
  const persesTimeRange = {
    pastDuration: '1h' as DurationString,
  };

  const queryDefinitions = [
    {
      kind: 'PrometheusTimeSeriesQuery',
      spec: {
        query: 'up',
      },
    },
  ];

  const panelDefinition: PanelDefinition = {
    kind: 'Panel',
    spec: {
      display: {
        name: 'Prometheus Query',
      },
      plugin: {
        kind: 'TimeSeriesChart',
        spec: {},
      },
    },
  };

  const muiTheme = getTheme('light');
  const chartsTheme = generateChartsTheme(muiTheme, {});

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
