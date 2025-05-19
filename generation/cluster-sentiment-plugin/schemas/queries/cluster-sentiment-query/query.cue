package model

import (
	"strings"
)

kind: "ClusterSentimentQuery"
spec: close({
	datasource?: {
		kind: "YourDatasourceKind"
	}
	query:             strings.MinRunes(1)
})
