import { DatasourceSelect, DatasourceSelectProps, isVariableDatasource, OptionsEditorProps } from '@perses-dev/plugin-system';
import { ReactElement } from 'react';
import { ClusterSentimentQuerySpec } from './cluster-sentiment-query-types';
import { DATASOURCE_KIND, DEFAULT_DATASOURCE } from './constants';

type ClusterSentimentQueryEditorProps = OptionsEditorProps<ClusterSentimentQuerySpec>;

export function ClusterSentimentQueryEditor(props: ClusterSentimentQueryEditorProps): ReactElement {
  const { onChange, value } = props;
  const {datasource} = value;
  const selectedDatasource = datasource ?? DEFAULT_DATASOURCE;

  const handleDatasourceChange: DatasourceSelectProps['onChange'] = (newDatasourceSelection) => {
    if(!isVariableDatasource(newDatasourceSelection) && newDatasourceSelection.kind === DATASOURCE_KIND) {
      onChange({ ...value, datasource: newDatasourceSelection });
      return;
    }

    throw new Error('Got unexpected non ClusterSentimentQuery datasource selection');
  };

  const handleQueryBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    if (newQuery !== value.query) {
      onChange({ ...value, query: newQuery });
    }
  };

  return (
    <div>
      <label>ClusterSentimentQuery Datasource</label>
      <DatasourceSelect
          datasourcePluginKind={DATASOURCE_KIND}
          value={selectedDatasource}
          onChange={handleDatasourceChange}
          label="ClusterSentimentQuery Datasource"
          notched
        />
      <input onBlur={handleQueryBlur} value={value.query} />
    </div>
  );
}
