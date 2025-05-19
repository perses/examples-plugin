import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 9915;

app.use(express.json());

interface SentimentDataPoint {
  timestamp: number;
  value: number;
  clusterId: string;
  sentiment: string;
}

const clusters = [
  { name: 'cluster-1', id: '1', randomData: () => Math.floor(Math.random() * 100) },
  { name: 'cluster-2', id: '2', randomData: (index:number) => Math.floor(Math.abs(Math.sin(index * 0.1)) * 100) },
]

// Helper function to generate mock time series data
const generateTimeSeriesData = ({ startTime, endTime, clusterId }: { startTime: number; endTime: number; clusterId?:string }): SentimentDataPoint[] => {
  const data: SentimentDataPoint[] = [];

  if (startTime > endTime) {
    return []; // Return empty for invalid or impossible range
  }

  const clustersFilter = clusterId == "*"? clusters : clusters.filter((c) => c.id === clusterId);
  
  if(clustersFilter.length === 0) {
    return []; // Return empty if no cluster matches the given clusterId  
  }

  let pointIndex = 0;
  for (let currentTime = startTime; currentTime <= endTime; currentTime += 1000 * 30) {
    for (const cluster of clustersFilter) {
      data.push({
        timestamp: currentTime,
        value: cluster.randomData(pointIndex++),
        clusterId: cluster.id,
        sentiment: ['happy', 'stressed', 'worried'][Math.floor(Math.random() * 3)],
      });
    }
  }

  return data;
};


app.get('/api/v1/clusters', (req: Request, res: Response) => {
  res.json(clusters.map(cluster => ({
    name: cluster.name,
    id: cluster.id,
  })));
});

app.get('/api/v1/metrics', (req: Request, res: Response) => {
  const { query, start, end } = req.query;

  let parsedStartTime: number | undefined = undefined;
  let parsedEndTime: number | undefined = undefined;

  if(!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing required parameter: query' });
  }

  const clusterId = /clusterId="([a-z0-9\*]+)"/.exec(query)?.[1];

  if (!clusterId || typeof clusterId !== 'string') {
    return res.status(400).json({ error: 'Invalid clusterId parameter, either missing or not a string.' });
  }

  if (start) {
    const tempStart = parseInt(start as string, 10);
    if (isNaN(tempStart)) {
      return res.status(400).json({ error: 'Invalid start time parameter. It must be a number (Unix milliseconds).' });
    }
    parsedStartTime = tempStart;
  }

  if (end) {
    const tempEnd = parseInt(end as string, 10);
    if (isNaN(tempEnd)) {
      return res.status(400).json({ error: 'Invalid end time parameter. It must be a number (Unix milliseconds).' });
    }
    parsedEndTime = tempEnd;
  }

  const now = Date.now();
  const effectiveEndTime = parsedEndTime !== undefined ? parsedEndTime : now;
  const effectiveStartTime = parsedStartTime !== undefined ? parsedStartTime : effectiveEndTime - (60 * 60 * 1000);

  // Validate that effectiveStartTime is not after effectiveEndTime
  if (effectiveStartTime > effectiveEndTime) {
    return res.status(400).json({ error: 'Calculated start time is after end time. Please check your input or ensure the default range is valid.' });
  }

  const sentimentData = generateTimeSeriesData({ startTime: effectiveStartTime, endTime: effectiveEndTime, clusterId });

  res.json({ data: sentimentData });
});

app.listen(port, () => {
  console.log(`Sentiment API server listening on port ${port}`);
});
