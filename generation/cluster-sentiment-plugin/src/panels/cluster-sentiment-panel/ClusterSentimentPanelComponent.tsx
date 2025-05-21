import { ReactElement, useMemo } from "react";
import { ClusterSentimentPanelProps } from "./cluster-sentiment-panel-types";
import { TimeSeriesValueTuple } from "@perses-dev/core";

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
  
  const clustersData = useMemo(() => {
    const firstQueryResult = queryResults[0];
    
    if (firstQueryResult === undefined) {
      return [];
    }

    const data = new Map<string, any>();
    for (const item of firstQueryResult.data.series) {
      const { name, values, labels } = item;
      const clusterId = name;
      const lastValue = values[values.length - 1];

      if (!data.has(clusterId) && lastValue) {
        data.set(clusterId, { clusterId: labels?.clusterId, timesamp: lastValue[0], value: lastValue[1], sentiment: labels?.sentiment });
      }
    }

    return Array.from(data.values())
  }, [queryResults]);

  if (clustersData.length == 0) {
    return <div>No data</div>
  }

  return <div style={{ 
      display: 'flex',
      gap:"8px",
      padding:"8px" 
    }}>
    {clustersData.map((cluster) => (
      <div key={cluster.clusterId} style={{ border: "1px solid gray", padding: "8px", borderRadius: "4px" }}>
        <p>I'm cluster {cluster.clusterId}, and I'm feeling {spec.displayMode == "text" ? `${cluster.value}% ${cluster.sentiment}` : sentimentToEmoji(cluster.sentiment)}</p>
      </div>
    ))}
  </div>;
}