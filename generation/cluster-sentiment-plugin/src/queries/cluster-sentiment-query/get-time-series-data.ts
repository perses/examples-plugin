import { TimeSeriesData, TimeSeries } from '@perses-dev/core';
import { TimeSeriesQueryPlugin, replaceVariables } from '@perses-dev/plugin-system';
import { ClusterSentimentQuerySpec, DatasourceQueryResponse } from './cluster-sentiment-query-types';
import { DEFAULT_DATASOURCE } from './constants';
import { ClusterSentimentDatasourceClient } from '../../datasources/cluster-sentiment-datasource';

function buildTimeSeries(response?: DatasourceQueryResponse): TimeSeries[] {
  if (!response) {
    return [];
  }

  let map: Map<string, TimeSeries> = new Map();

  // group by clusterId and sentiment
  for(const point of response.data) {
    const key = point.clusterId + point.sentiment;
    let series = map.get(key);
    
    if (!series) {
      series = {
        name: `${point.clusterId} ${point.sentiment}`,
        labels: { sentiment: point.sentiment, clusterId: point.clusterId },
        values: [[ point.timestamp, point.value ]],
      };
    }

    series.values.push([ point.timestamp, point.value ]);
    map.set(key, series);
  }

  return Array.from(map.values());
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

  const { start, end } = context.timeRange;

  const response = await client.query({ 
    start: start.getTime().toString(),
    end: end.getTime().toString(),
    query,
  });

  const chartData: TimeSeriesData = {
    series: buildTimeSeries(response),
    timeRange: { start, end },
    stepMs: 30 * 1000,
    metadata: {
      executedQueryString: query,
    },
  };

  return chartData;
}
