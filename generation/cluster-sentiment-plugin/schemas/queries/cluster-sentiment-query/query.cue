package model

import (
	"strings"
)

kind: "ClusterSentimentQuery"
spec: close({
	datasource?: {
		kind: "ClusterSentimentDatasource"
	}
	query:             strings.MinRunes(1)
})
