import { HTTPSettingsEditor } from '@perses-dev/plugin-system';
import React, { ReactElement } from 'react';
import { ClusterSentimentDatasourceSpec } from './cluster-sentiment-datasource-types';

export interface ClusterSentimentDatasourceEditorProps {
  value: ClusterSentimentDatasourceSpec;
  onChange: (next: ClusterSentimentDatasourceSpec) => void;
  isReadonly?: boolean;
}

export function ClusterSentimentDatasourceEditor(props: ClusterSentimentDatasourceEditorProps): ReactElement {
  const { value, onChange, isReadonly } = props;

  const initialSpecDirect: ClusterSentimentDatasourceSpec = {
    directUrl: '',
  };

  const initialSpecProxy: ClusterSentimentDatasourceSpec = {
    proxy: {
      kind: 'HTTPProxy',
      spec: {
        allowedEndpoints: [
          // Adjust based on your API
          {
            endpointPattern: '/api/search',
            method: 'GET',
          },
        ],
        url: '',
      },
    },
  };

  return (
    <HTTPSettingsEditor
      value={value}
      onChange={onChange}
      isReadonly={isReadonly}
      initialSpecDirect={initialSpecDirect}
      initialSpecProxy={initialSpecProxy}
    />
  );
}
