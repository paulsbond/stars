"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

function CalculatePoints(numPoints: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const x = 250 + 200 * Math.sin(angle);
    const y = 250 - 200 * Math.cos(angle);
    points.push({ x, y });
  }
  return points;
}

function DrawCircle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(250, 250, 200, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333";
  ctx.stroke();
}

function DrawStar(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  numSkip: number,
) {
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    const next = (i + numSkip + 1) % points.length;
    ctx.lineTo(points[next].x, points[next].y);
    ctx.strokeStyle = "#eee";
    ctx.stroke();
  }
}

function IntField(props: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex items-center gap-2">
      <span>{props.label}</span>
      <input
        value={props.value}
        onChange={(e) =>
          props.onChange(
            parseInt(e.target.value) === undefined
              ? props.value
              : parseInt(e.target.value),
          )
        }
        type="number"
        min={props.min}
        max={props.max}
        className="w-32 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1"
      />
    </label>
  );
}

export default function Home() {
  const [numPoints, setNumPoints] = useState(5);
  const [numSkip, setNumSkip] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxSkips = Math.floor((numPoints - 1) / 2) - 1;
  const points = useMemo(() => CalculatePoints(numPoints), [numPoints]);

  if (numSkip > maxSkips) setNumSkip(maxSkips);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.reset();
    DrawCircle(ctx);
    DrawStar(ctx, points, numSkip);
  }, [canvasRef.current, numPoints, numSkip]);

  return (
    <main className="flex h-svh w-svw flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-end gap-2">
        <IntField
          label="Number of Points"
          value={numPoints}
          onChange={setNumPoints}
          min={5}
        />
        <IntField
          label="Points to Skip"
          value={numSkip}
          onChange={setNumSkip}
          min={1}
          max={maxSkips}
        />
      </div>
      <canvas width="500" height="500" ref={canvasRef}></canvas>
    </main>
  );
}
