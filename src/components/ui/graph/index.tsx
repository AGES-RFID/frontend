import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import type { IChartRenderer } from "./IChartRenderer";
import { D3ChartRenderer, getColor } from "./renderd3";
import type { GraphData, GraphProps } from "./types";

export function Graph({
  title = "Gráfico de linhas",
  series = [],
  width = 800,
  height = 400,
  className,
}: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rendererRef = useRef<IChartRenderer | null>(null);

  useEffect(() => {
    if (!rendererRef.current) {
      rendererRef.current = new D3ChartRenderer();
    }

    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || series.length === 0) return;

    rendererRef.current?.render({
      svgElement: svgRef.current,
      series,
      width,
      height,
    });
  }, [series, width, height]);

  const hasData = series.some((line) => line.points.length > 0);

  return (
    <div className={cn("rounded-xl bg-white p-6 drop-shadow-lg", className)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-bold text-dark-gray text-xl">{title}</h2>

        {series.length > 0 ? (
          <div className="flex flex-wrap items-center gap-6">
            {series.map((lineSeries, i) => (
              <div key={lineSeries.name} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: getColor(lineSeries.color, i) }}
                />
                <span className="text-gray text-sm">{lineSeries.name}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {!hasData ? (
        <div
          className="flex items-center justify-center text-gray text-sm"
          style={{ height }}
        >
          Sem dados para exibir.
        </div>
      ) : (
        <svg ref={svgRef} width={width} height={height} />
      )}
    </div>
  );
}

export type { GraphData };
