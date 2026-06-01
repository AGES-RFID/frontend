export type GraphData = {
  hour: string;
  entry: number;
  exit: number;
};

export type GraphProps = {
  data?: GraphData[];
  width?: number;
  height?: number;
};

export type VehicleFlowApiResponse = {
  hour: number;
  entries: number;
  exits: number;
};
