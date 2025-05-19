import { Notice, TimeSeries, TimeSeriesData } from '@perses-dev/core';
import { TimeSeriesQueryPlugin, replaceVariables } from '@perses-dev/plugin-system';
import { ClusterSentimentQuerySpec, DatasourceQueryResponse } from './cluster-sentiment-query-types';
import { DEFAULT_DATASOURCE } from './constants';

function buildTimeSeries(response?: DatasourceQueryResponse): TimeSeries[] {
  if (!response) {
    return [];
  }

  let series: TimeSeries[] = [];

  series.push({
    name: 'happy',
    values: response.data.data.happy.map((point) => [point.timestamp, point.value]),
  });
  series.push({
    name: 'stressed',
    values: response.data.data.stressed.map((point) => 
      [point.timestamp,point.value]
    ),
  });
  series.push({
    name: 'worried',
    values: response.data.data.worried.map((point) => [point.timestamp, point.value]),
  });

  return series
}

export const getTimeSeriesData: TimeSeriesQueryPlugin<ClusterSentimentQuerySpec>['getTimeSeriesData'] = async (
  spec,
  context
) => {
  // return empty data if the query is empty
  if (spec.query === undefined || spec.query === null || spec.query === '') {
    return { series: [] };
  }

  const query = replaceVariables(spec.query, context.variableState);

  const client = await context.datasourceStore.getDatasourceClient(
    // A default datasource will be selected by matching the kind of datasource if not provided
    spec.datasource ?? DEFAULT_DATASOURCE
  );

  const response = await client.query({ query });

  // Custom display for response header warnings, configurable error responses display coming next
  const notices: Notice[] = [];
  if (response.status === 'success') {
    const warnings = response.warnings ?? [];
    const warningMessage = warnings[0] ?? '';
    if (warningMessage !== '') {
      notices.push({
        type: 'warning',
        message: warningMessage,
      });
    }
  }

  const chartData: TimeSeriesData = {
    series: buildTimeSeries(response),
    metadata: {
      notices,
      executedQueryString: query,
    },
  };

  return chartData;
}
