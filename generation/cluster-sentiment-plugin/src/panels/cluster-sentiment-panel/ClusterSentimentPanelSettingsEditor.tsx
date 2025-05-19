import {
  OptionsEditorGrid,
  OptionsEditorColumn,
  ThresholdsEditor,
  ThresholdsEditorProps,
} from '@perses-dev/components';
import { LegendOptionsEditor, LegendOptionsEditorProps, OptionsEditorProps } from '@perses-dev/plugin-system';
import { ReactElement } from 'react';
import { ClusterSentimentPanelOptions } from './cluster-sentiment-panel-types';

type ClusterSentimentPanelSettingsEditorProps = OptionsEditorProps<ClusterSentimentPanelOptions>;

export function ClusterSentimentPanelSettingsEditor(props: ClusterSentimentPanelSettingsEditorProps): ReactElement {
  const { onChange, value } = props;

  const handleLegendChange: LegendOptionsEditorProps['onChange'] = (newLegend) => {
    onChange({...value, legend: newLegend });
  };

  const handleThresholdsChange: ThresholdsEditorProps['onChange'] = (thresholds) => {
    onChange({...value, thresholds });
  };

  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <LegendOptionsEditor value={value.legend} onChange={handleLegendChange} />
      </OptionsEditorColumn>
      <OptionsEditorColumn>
        <ThresholdsEditor hideDefault thresholds={value.thresholds} onChange={handleThresholdsChange} />
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}
