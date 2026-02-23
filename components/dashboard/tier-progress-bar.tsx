"use client"

interface TierProgressBarProps {
  currentValue: number
  bronze: number
  silver: number
  gold: number
  unit: string
}

export function TierProgressBar({
  currentValue,
  bronze,
  silver,
  gold,
  unit,
}: TierProgressBarProps) {
  const maxValue = gold * 1.1
  const percent = Math.min((currentValue / maxValue) * 100, 100)
  const bronzePercent = (bronze / maxValue) * 100
  const silverPercent = (silver / maxValue) * 100
  const goldPercent = (gold / maxValue) * 100

  const currentTier =
    currentValue >= gold
      ? "gold"
      : currentValue >= silver
        ? "silver"
        : currentValue >= bronze
          ? "bronze"
          : "none"

  const barColor =
    currentTier === "gold"
      ? "bg-amber-400"
      : currentTier === "silver"
        ? "bg-slate-400"
        : currentTier === "bronze"
          ? "bg-orange-400"
          : "bg-primary/40"

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {currentValue.toLocaleString()} {unit}
        </span>
        {currentTier !== "none" && (
          <span className="text-xs font-medium text-muted-foreground">
            {currentTier === "gold"
              ? "Gold reached!"
              : currentTier === "silver"
                ? `${(gold - currentValue).toLocaleString()} ${unit} to Gold`
                : `${(silver - currentValue).toLocaleString()} ${unit} to Silver`}
          </span>
        )}
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/20"
          style={{ left: `${bronzePercent}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/20"
          style={{ left: `${silverPercent}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/20"
          style={{ left: `${goldPercent}%` }}
        />
      </div>
      <div className="relative flex h-4 items-center text-[10px] font-medium text-muted-foreground">
        <span className="absolute" style={{ left: `${bronzePercent}%`, transform: "translateX(-50%)" }}>
          {"🥉"}
        </span>
        <span className="absolute" style={{ left: `${silverPercent}%`, transform: "translateX(-50%)" }}>
          {"🥈"}
        </span>
        <span className="absolute" style={{ left: `${goldPercent}%`, transform: "translateX(-50%)" }}>
          {"🥇"}
        </span>
      </div>
    </div>
  )
}
