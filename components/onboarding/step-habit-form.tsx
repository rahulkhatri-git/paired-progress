"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type HabitType = "binary" | "tiered"
type Priority = "low" | "medium" | "high"

export function StepHabitForm() {
  const [habitName, setHabitName] = useState("")
  const [habitType, setHabitType] = useState<HabitType>("tiered")
  const [priority, setPriority] = useState<Priority>("medium")
  const [unit, setUnit] = useState("minutes")
  const [bronzeValue, setBronzeValue] = useState("")
  const [silverValue, setSilverValue] = useState("")
  const [goldValue, setGoldValue] = useState("")
  const [shareWithPartner, setShareWithPartner] = useState(true)
  const [requiresPhoto, setRequiresPhoto] = useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create your first habit
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Define a habit with tiers to challenge yourself at every level.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Habit Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="habit-name">Habit name</Label>
          <Input
            id="habit-name"
            placeholder="e.g. Morning Run, Read Together, Meditate"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          />
        </div>

        {/* Type + Priority */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Select
              value={habitType}
              onValueChange={(val) => setHabitType(val as HabitType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="binary">Binary (Done / Not Done)</SelectItem>
                <SelectItem value="tiered">Tiered (Bronze / Silver / Gold)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as Priority)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tier Values */}
        {habitType === "tiered" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Tier targets</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">minutes</SelectItem>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="miles">miles</SelectItem>
                  <SelectItem value="reps">reps</SelectItem>
                  <SelectItem value="pages">pages</SelectItem>
                  <SelectItem value="meals">meals</SelectItem>
                  <SelectItem value="glasses">glasses</SelectItem>
                  <SelectItem value="steps">steps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Bronze */}
              <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-lg">{"\u{1F949}"}</span>
                  <span className="text-xs font-semibold text-orange-700">
                    Bronze
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={bronzeValue}
                  onChange={(e) => setBronzeValue(e.target.value)}
                  className="h-8 border-orange-200 bg-background text-sm"
                />
                <p className="mt-1 text-[10px] text-orange-600/70">{unit}</p>
              </div>

              {/* Silver */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-lg">{"\u{1F948}"}</span>
                  <span className="text-xs font-semibold text-slate-600">
                    Silver
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="e.g. 3"
                  value={silverValue}
                  onChange={(e) => setSilverValue(e.target.value)}
                  className="h-8 border-slate-200 bg-background text-sm"
                />
                <p className="mt-1 text-[10px] text-slate-500">{unit}</p>
              </div>

              {/* Gold */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-lg">{"\u{1F947}"}</span>
                  <span className="text-xs font-semibold text-amber-700">
                    Gold
                  </span>
                </div>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={goldValue}
                  onChange={(e) => setGoldValue(e.target.value)}
                  className="h-8 border-amber-200 bg-background text-sm"
                />
                <p className="mt-1 text-[10px] text-amber-600/70">{unit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Toggles */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Share with partner
              </p>
              <p className="text-xs text-muted-foreground">
                Your partner can see and review this habit
              </p>
            </div>
            <Switch
              checked={shareWithPartner}
              onCheckedChange={setShareWithPartner}
            />
          </div>
          <div className="h-px bg-border/60" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Requires photo proof
              </p>
              <p className="text-xs text-muted-foreground">
                Must upload a photo when logging
              </p>
            </div>
            <Switch
              checked={requiresPhoto}
              onCheckedChange={setRequiresPhoto}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
