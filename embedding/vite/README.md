# Embedding

# Use case

You want to embed a Perses plugin into your react app.

# Example

For the example we will use the time series chart plugin consuming data from a prometheus API using the Perses prometheus plugin.

1. Install Perses required dependencies and Perses plugins

```bash
npm install @perses-dev/plugin-system @perses-dev/prometheus-plugin @perses-dev/timeseries-chart-plugin
```

2. Install required peer dependencies

```bash
npm install react-router-dom react-hook-form @tanstack/react-query use-query-params @mui/material @emotion/react @emotion/styled @hookform/resolvers@^3.2.1
```

2. Create a PersesWrapper component that will initialize the required Context Providers

```tsx

```
