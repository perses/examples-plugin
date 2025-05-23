import { ThemeProvider } from '@emotion/react';
import { PluginRegistry } from '@perses-dev/plugin-system';
import { ChartsProvider, ErrorAlert, ErrorBoundary } from '@perses-dev/components';
import { pluginLoader } from './PersesPluginRegistry';
import { muiTheme, chartsTheme } from '../persesApi';

type PersesDashboardProps = {
  children: React.ReactNode;
};

export function PersesDashboardProvider({ children }: PersesDashboardProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      <ChartsProvider chartsTheme={chartsTheme}>
        <ErrorBoundary FallbackComponent={ErrorAlert}>
          <PluginRegistry pluginLoader={pluginLoader}>{children}</PluginRegistry>
        </ErrorBoundary>
      </ChartsProvider>
    </ThemeProvider>
  );
}
