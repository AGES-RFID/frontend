import { useEffect, useRef } from "react";

import { renderD3 } from "./renderd3";

import type { GraphData, GraphProps } from "./types";

const mockData: GraphData[] = [
  {
    hour: "14",
    entry: 20,
    exit: 35,
  },
  {
    hour: "13",
    entry: 15,
    exit: 10,
  },
  {
    hour: "12",
    entry: 30,
    exit: 25,
  },
  {
    hour: "11",
    entry: 12,
    exit: 18,
  },
];

export function Graph({
  data = mockData,
  width = 800,
  height = 400,
}: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    renderD3({
      svgElement: svgRef.current,
      data,
      width,
      height,
    });
  }, [data, width, height]);

  return (
    <div className="rounded-xl bg-white p-4">
      <h2 className="mb-4 font-bold text-xl">Fluxo de veículos por hora</h2>

      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
