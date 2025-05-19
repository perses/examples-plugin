# Cluster Sentiment API

This is a mock API that simulates a cluster sentiment API. It provides endpoints to get the sentiment of a cluster based on the number of happy, stressed, and worried people in the cluster.

## Endpoints
- GET `/api/v1/clusters`: List the clusters details
- GET `/api/v1/metrics`: Search metrics for clusters given the following query parameters:
  - `clusterId` (string): Id of the cluster to search for, if omitted, all clusters will be searched.
  - `start` (timestamp): The start date for the search. Default is 1 hour ago.
  - `end` (timestamp): The end date for the search. Default is now.

## Usage
1. install dependencies:
```bash
npm install
```
2. run the api:
```bash
npm start
```