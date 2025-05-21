import { ClusterSentimentPanelComponent } from "./ClusterSentimentPanelComponent";
import { ClusterSentimentPanelOptions, ClusterSentimentPanelProps } from "./cluster-sentiment-panel-types";
import { PanelPlugin } from "@perses-dev/plugin-system";
import { ClusterSentimentPanelSettingsEditor } from "./ClusterSentimentPanelSettingsEditor";

export const ClusterSentimentPanel: PanelPlugin<ClusterSentimentPanelOptions, ClusterSentimentPanelProps> = {
  PanelComponent: ClusterSentimentPanelComponent,
  panelOptionsEditorComponents: [{ label: 'Settings', content: ClusterSentimentPanelSettingsEditor }],
  supportedQueryTypes: ['TimeSeriesQuery'],
  createInitialOptions: () => ({ displayMode: "text" }),
};
