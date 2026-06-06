export type GraphPoint = {
  timestamp: string;
  value: number;
};

export type GraphSeries = {
  name: string;
  points: GraphPoint[];
  color?: string;
};

export type GraphData = GraphSeries[];

export type GraphProps = {
  title?: string;
  series?: GraphSeries[];
  width?: number;
  height?: number;
};
