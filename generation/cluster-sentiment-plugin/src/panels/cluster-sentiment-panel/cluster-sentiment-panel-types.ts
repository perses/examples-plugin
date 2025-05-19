import { TimeSeriesData, ThresholdOptions } from "@perses-dev/core";
import { PanelProps, LegendSpecOptions } from '@perses-dev/plugin-system';

export type QueryData = TimeSeriesData; // Shape of the data returned by a query plugin

export type ClusterSentimentPanelProps = PanelProps<ClusterSentimentPanelOptions, QueryData>;

export interface QuerySettingsOptions {
  queryIndex: number;
  colorValue: string;
}

export interface ClusterSentimentPanelOptions {
  legend?: LegendSpecOptions;
  thresholds?: ThresholdOptions;
  querySettings?: QuerySettingsOptions;
}

