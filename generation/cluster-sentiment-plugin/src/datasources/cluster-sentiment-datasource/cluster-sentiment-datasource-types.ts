import { HTTPProxy, RequestHeaders } from '@perses-dev/core';
import { DatasourceClient } from '@perses-dev/plugin-system';

export interface ClusterSentimentDatasourceSpec {
  directUrl?: string;
  proxy?: HTTPProxy;
}

interface QueryRequestParameters extends Record<string, string | undefined> {
  query: string;
  start?: string;
  end?: string;
}

interface ClusterSentimentDatasourceClientOptions {
  datasourceUrl: string;
  headers?: RequestHeaders;
}

 interface SentimentMetric {
   clusterId: string;
   value: number;
   timestamp: number;
   sentiment: string;
 }

export interface ClusterSentimentDatasourceResponse {
  status: string;
  warnings?: string[];
  data: Array<SentimentMetric>;
};

export interface ClusterSentimentDatasourceClient extends DatasourceClient {
  options: ClusterSentimentDatasourceClientOptions;
  query(params: QueryRequestParameters, headers?: RequestHeaders): Promise<ClusterSentimentDatasourceResponse>;
}