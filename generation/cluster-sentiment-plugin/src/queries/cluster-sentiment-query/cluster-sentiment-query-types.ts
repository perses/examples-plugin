import { DatasourceSelector } from '@perses-dev/core';
import { ClusterSentimentDatasourceResponse } from '../../datasources/cluster-sentiment-datasource';

export interface ClusterSentimentQuerySpec {
  query: string;
  datasource?: DatasourceSelector;
}

export type DatasourceQueryResponse = ClusterSentimentDatasourceResponse;
