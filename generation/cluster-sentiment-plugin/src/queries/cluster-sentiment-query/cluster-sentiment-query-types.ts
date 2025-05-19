import { DatasourceSelector } from '@perses-dev/core';
import { ClusterSentimentDatasourceResponse } from '../../datasources/cluster-sentiment-datasource';

export interface ClusterSentimentQuerySpec {
  query: string;
  datasource?: DatasourceSelector;
}

// TODO: import this type from your datasource or an existing datasource plugin
export type DatasourceQueryResponse = {
  status: string;
  data: ClusterSentimentDatasourceResponse;
  warnings?: string[];
};
