import { fetch } from '@perses-dev/core';
import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { ClusterSentimentDatasourceSpec, ClusterSentimentDatasourceClient } from './cluster-sentiment-datasource-types';
import { ClusterSentimentDatasourceEditor } from './ClusterSentimentDatasourceEditor';

const createClient: DatasourcePlugin<ClusterSentimentDatasourceSpec, ClusterSentimentDatasourceClient>['createClient'] = (spec, options) => {
  const { directUrl, proxy } = spec;
  const { proxyUrl } = options;

  // Use the direct URL if specified, but fallback to the proxyUrl by default if not specified
  const datasourceUrl = directUrl ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error('No URL specified for ClusterSentimentDatasource client. You can use directUrl in the spec to configure it.');
  }

  const specHeaders = proxy?.spec.headers;

  return {
    options: {
      datasourceUrl,
    },
    query: async (params, headers) => {
      let url = `${datasourceUrl}/api/search`;
      if (params) {
        url += '?' + new URLSearchParams(params);
      }
      const init = {
        method: 'GET',
        headers: headers ?? specHeaders,
      };

      const response = await fetch(url, init);

      try {
        return await response.json();
      } catch (e) {
        console.error('Invalid response from server', e);
        throw new Error('Invalid response from server');
      }
    },
  };
};

export const ClusterSentimentDatasourceDatasource: DatasourcePlugin<ClusterSentimentDatasourceSpec, ClusterSentimentDatasourceClient> = {
  createClient,
  OptionsEditorComponent: ClusterSentimentDatasourceEditor,
  createInitialOptions: () => ({ directUrl: '' }),
};