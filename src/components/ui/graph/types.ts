export type GraphData = {
  hour: string;
  entrada: number;
  saida: number;
};

export type GraphProps = {
  data: GraphData[];
  width?: number;
  height?: number;
};
