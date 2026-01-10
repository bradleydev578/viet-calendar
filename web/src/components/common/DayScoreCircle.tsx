"use client";

import { DayScore } from "@/lib/fengshui";

interface DayScoreCircleProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export function DayScoreCircle({
  score,
  size = 80,
  showLabel = true,
}: DayScoreCircleProps) {
  const quality = DayScore.getQuality(score);
  const color = DayScore.getQualityColor(quality);
  const label = DayScore.getQualityLabel(quality);

  // SVG calculations
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          className="score-circle"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold"
          style={{ color, fontSize: size * 0.25 }}
        >
          {score}%
        </span>
        {showLabel && (
          <span
            className="text-neutral-500"
            style={{ fontSize: size * 0.12 }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
