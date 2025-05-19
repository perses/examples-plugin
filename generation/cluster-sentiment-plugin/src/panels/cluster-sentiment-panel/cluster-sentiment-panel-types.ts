import { TimeSeriesData, ThresholdOptions } from "@perses-dev/core";
import { PanelProps, LegendSpecOptions } from '@perses-dev/plugin-system';

export type QueryData = TimeSeriesData; // Type of data returned by a query plugin and supported by this plugin

export type ClusterSentimentPanelProps = PanelProps<ClusterSentimentPanelOptions, QueryData>;

export interface QuerySettingsOptions {
  queryIndex: number;
  colorMode: 'fixed' | 'fixed-single';
  colorValue: string;
}

export interface ClusterSentimentPanelOptions {
  legend?: LegendSpecOptions;
  thresholds?: ThresholdOptions;
  querySettings?: QuerySettingsOptions;
}

