import { useEffect, useRef } from "react";
import { D3ChartRenderer } from "./renderd3";
import type { IChartRenderer } from "./IChartRenderer";
import type { GraphData, GraphProps } from "./types";

export function Graph({ data = [], width = 800, height = 400 }: GraphProps) {
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
    if (!svgRef.current || data.length === 0) return;

    rendererRef.current?.render({
      svgElement: svgRef.current,
      data,
      width,
      height,
    });
  }, [data, width, height]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-bold text-dark-gray text-xl">
          Fluxo de veículos por hora
        </h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--color-blue)" }}
            />
            <span className="text-gray text-sm">Entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: "var(--color-dark-orange)" }}
            />
            <span className="text-gray text-sm">Saídas</span>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div
          className="flex items-center justify-center text-gray text-sm"
          style={{ height }}
        >
          Carregando dados...
        </div>
      ) : (
        <svg ref={svgRef} width={width} height={height} />
      )}
    </div>
  );
}

export type { GraphData };
