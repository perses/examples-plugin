import { HTTPProxy, RequestHeaders } from '@perses-dev/core';
import { DatasourceClient } from '@perses-dev/plugin-system';

export interface ClusterSentimentDatasourceSpec {
  directUrl?: string;
  proxy?: HTTPProxy;
}

interface QueryRequestParameters extends Record<string, string> {
  query: string;
  start: string;
  end: string;
}

interface ClusterSentimentDatasourceClientOptions {
  datasourceUrl: string;
  headers?: RequestHeaders;
}

export interface ClusterSentimentDatasourceResponse {
  data: {
    happy: Array<{ clusterId: string, value: number, timestamp: number }>,
    stressed: Array<{ clusterId: string, value: number, timestamp: number }>,
    worried: Array<{ clusterId: string, value: number, timestamp: number }>,
  }
};

export interface ClusterSentimentDatasourceClient extends DatasourceClient {
  options: ClusterSentimentDatasourceClientOptions;
  query(params: QueryRequestParameters, headers?: RequestHeaders): Promise<ClusterSentimentDatasourceResponse>;
}