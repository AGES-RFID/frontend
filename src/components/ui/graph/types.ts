export type AccessApiResponse = {
  access_id: string;
  tag_id: string;
  type: "Entry" | "Exit";
  timestamp: string;
};

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
