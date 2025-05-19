import { ReactElement, useMemo } from "react";
import { ClusterSentimentPanelProps } from "./cluster-sentiment-panel-types";

function sentimentToEmoji(sentiment: string | undefined): string {
  switch (sentiment) {
    case "happy":
      return "😊";
    case "stressed":
      return "😰";
    case "worried":
      return "😟";
    default:
      return "🤔";
  }
}

export function ClusterSentimentPanelComponent(props: ClusterSentimentPanelProps): ReactElement | null {
  const { queryResults, spec } = props;

  const firstQueryResult = queryResults[0];

  const clustersData = useMemo(() => {
    if (firstQueryResult === undefined) {
      return [];
    }

    const data = [];
    for (const item of firstQueryResult.data.series) {
      const { name, values, labels } = item;
      const clusterId = name;
      const lastValue = values[values.length - 1];

      data.push({ clusterId, lastValue, sentiment: labels?.sentiment });
    }

    return data;
  }, [firstQueryResult]);

  if (clustersData.length == 0) {
    return <div>No data</div>
  }

  return <div style={{ 
      display: 'grid',
      alignContent:"center",
      gap:"4px",
      padding:"4px" }}>
    {clustersData.map((cluster) => (
      <div key={cluster.clusterId}>
        <p>I'm cluster {cluster.clusterId}, and I'm feeling {spec.displayMode == "text" ? cluster.sentiment : sentimentToEmoji(cluster.sentiment)}</p>
      </div>
    ))}
  </div>;
}