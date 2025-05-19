import { TimeSeriesQueryPlugin, parseVariables } from '@perses-dev/plugin-system';
import { getTimeSeriesData } from './get-time-series-data';
import { ClusterSentimentQueryEditor } from './ClusterSentimentQueryEditor';
import { ClusterSentimentQuerySpec } from './cluster-sentiment-query-types';

export const ClusterSentimentQuery: TimeSeriesQueryPlugin<ClusterSentimentQuerySpec> = {
  getTimeSeriesData,
  OptionsEditorComponent: ClusterSentimentQueryEditor,
  createInitialOptions: () => ({ query: '' }),
  dependsOn: (spec) => {
    const queryVariables = parseVariables(spec.query);
    const allVariables = [...new Set([...queryVariables])];
    return {
      variables: allVariables,
    };
  },
};
