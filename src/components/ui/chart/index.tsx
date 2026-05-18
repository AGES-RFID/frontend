import * as d3 from "d3";
import { useEffect, useRef } from "react";

export function Chart() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 800;
  const height = 400;

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg.append("text").attr("x", 50).attr("y", 50).text("Chart initialized");
  }, []);

  return <svg ref={svgRef} width={width} height={height} />;
}
