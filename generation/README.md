# Generation

# Use case

You want to create a Perses plugin and will use the `percli` tool to generate one.

# Tutorial

The following tutorial will guide you through the process of creating a new plugin module for consuming an hypothetical [cluster sentiment API](./sentiment-api/README.md).
Here is a brief overview of the steps you will take:
1. [Generate a plugin module with a datasource plugin](#generate-a-plugin-module-with-a-datasource-plugin) that will allow you to query the cluster sentiment API.
2. [Generate a time series query plugin](#generate-a-timeseriesquery-plugin) that will allow you to transform the data returned by the datasource plugin into a format that can be used by a panel plugin.
3. [Generate a panel plugin](#generate-a-panel-plugin) that will display the data returned by the query plugin in a chart.
4. Generate a variable plugin that will allow you to list items based on a query to the cluster sentiment API.
5. Install the plugin in your local Perses instance.
6. Create a dashboard that uses the plugin.


## Prerequisites
- You have a working installation of [Node.js](https://nodejs.org/en/download/) v22 and [NPM](https://www.npmjs.com/get-npm).
- You have installed [Perses CLI](https://perses.dev/perses/docs/cli/).
- You have [Perses running locally](https://perses.dev/perses/docs/installation/in-a-container/).

## Generate a plugin module with a Datasource plugin

1. create a new directory for your plugin:
```bash
mkdir cluster-sentiment-plugin
cd cluster-sentiment-plugin
```
2. Run the `percli generate` command to create a new plugin module and datasource plugin:
```bash
percli plugin generate --module.name=ClusterSentiment --module.org=sentiment-org --plugin.type=Datasource --plugin.name=ClusterSentimentDatasource
```
3. Install the required dependencies:
```bash
npm install
```
4. Adjust the endpoint to match the cluster sentiment API in `ClusterSentimentDatasource.tsx`
```diff
    query: async (params, headers) => {
-     let url = `${datasourceUrl}/api/search`;
+     let url = `${datasourceUrl}/api/v1/metrics`;
```
5. Adjust the datasource response type to match the cluster sentiment API response in `cluster-sentiment-datasource-types.ts`
```diff

+ interface SentimentMetric {
+   clusterId: string;
+   value: number;
+   timestamp: number;
+ }

interface ClusterSentimentDatasourceResponse{
  status: string;
  warnings?: string[];
- data: any;
+ data:{
+   happy: Array<SentimentMetric>,
+   stressed: Array<SentimentMetric>,
+   worried: Array<SentimentMetric>,
+ }
}
```
6. Adjust the query parameters to match the cluster sentiment API in `cluster-sentiment-datasource-types.ts`
```diff
- interface QueryRequestParameters extends Record<string, string> {
+ interface QueryRequestParameters extends Record<string, string | undefined> {
    query: string;
-   start: string;
-   end: string;
+   start?: string;
+   end?: string;
}
```

## Generate a TimeSeriesQuery plugin

1. Run the `percli generate` command to create a new query plugin:
```bash
percli plugin generate --plugin.type=TimeSeriesQuery --plugin.name=ClusterSentimentQuery
```

2. Match the datasource response and query response types in `cluster-sentiment-query-types.ts`:
```diff
+ import { ClusterSentimentDatasourceResponse } from '../../datasources/cluster-sentiment-datasource';

...

- export type DatasourceQueryResponse = {
-   status: string;
-   data: any;
-   warnings?: string[];
- };
+ export type DatasourceQueryResponse = ClusterSentimentDatasourceResponse;
```

3. Adjust the datasource kind in `constants.ts`, this will allow users in the UI to select the correct datasource:
```diff
- export const DATASOURCE_KIND = 'YourDatasourceKind';
+ export const DATASOURCE_KIND = 'ClusterSentimentDatasource';
```

4. Map your datasource data into a time series format in `get-time-series-data.ts`. The `ClusterSentimentQuery` plugin will be used to transform the data returned by the `ClusterSentimentDatasource` plugin into a format that can be used by a panel plugin:
```diff
- return response.data.map((res) => {
-   const { name, values } = res;
-   // TODO: map your data to the timeseries format expected for Panel plugins
-   return {
-     name,
-     values,
-   };
- });
+  let series: TimeSeries[] = [];
+
+  series.push({
+    name: 'happy',
+    values: response.data.happy.map((point) => [point.timestamp, point.value]),
+  });
+  series.push({
+    name: 'stressed',
+    values: response.data.stressed.map((point) => [point.timestamp,point.value]),
+  });
+  series.push({
+    name: 'worried',
+    values: response.data.worried.map((point) => [point.timestamp, point.value]),
+  });
+  return series;
```
5. Adjust the query client type in `get-time-series-data.ts`:
```diff
+ import { ClusterSentimentDatasourceClient } from '../../datasources/cluster-sentiment-datasource';

...

- const client = await context.datasourceStore.getDatasourceClient(
+ const client = await context.datasourceStore.getDatasourceClient<ClusterSentimentDatasourceClient>(
```
6. Pass the query parameters to the datasource client in `get-time-series-data.ts`, start and end are optional but are available in the context, which is selected by the user in the UI:
```diff
- const response = await client.query({ query });
+ const response = await client.query({ 
+   start: context.timeRange.start.getTime().toString(), 
+   end: context.timeRange.end.getTime().toString(),
+   query,
+ });
```

## Generate a Panel plugin
1. Run the `percli generate` command to create a new panel plugin:
```bash
percli plugin generate --plugin.type=Panel --plugin.name=ClusterSentimentPanel
```

