import { ReactElement } from "react";
import { ClusterSentimentPanelProps } from "./cluster-sentiment-panel-types";

export function ClusterSentimentPanelComponent(props: ClusterSentimentPanelProps): ReactElement | null {
  const { queryResults, spec } = props;

  console.log("Panel data", queryResults);
  console.log("Panel spec", spec);

  // TODO: implement your awesome panel component here

  return <div>Panel goes here!</div>;
}