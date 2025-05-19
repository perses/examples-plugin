import { TimeSeriesData, TimeSeries } from '@perses-dev/core';
import { TimeSeriesQueryPlugin, replaceVariables } from '@perses-dev/plugin-system';
import { ClusterSentimentQuerySpec, DatasourceQueryResponse } from './cluster-sentiment-query-types';
import { DEFAULT_DATASOURCE } from './constants';
import { ClusterSentimentDatasourceClient } from '../../datasources/cluster-sentiment-datasource';

function buildTimeSeries(response?: DatasourceQueryResponse): TimeSeries[] {
  if (!response) {
    return [];
  }

  let series: TimeSeries[] = [];

  series.push({
    name: 'happy',
    values: response.data.happy.map((point) => [point.timestamp, point.value]),
  });
  series.push({
    name: 'stressed',
    values: response.data.stressed.map((point) => 
      [point.timestamp,point.value]
    ),
  });
  series.push({
    name: 'worried',
    values: response.data.worried.map((point) => [point.timestamp, point.value]),
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

  const client = await context.datasourceStore.getDatasourceClient<ClusterSentimentDatasourceClient>(
    // A default datasource will be selected by matching the kind of datasource if not provided
    spec.datasource ?? DEFAULT_DATASOURCE
  );

  const response = await client.query({ 
    start: context.timeRange.start.getTime().toString(), 
    end: context.timeRange.end.getTime().toString(),
    query,
  });

  const chartData: TimeSeriesData = {
    series: buildTimeSeries(response),
    metadata: {
      executedQueryString: query,
    },
  };

  return chartData;
}
