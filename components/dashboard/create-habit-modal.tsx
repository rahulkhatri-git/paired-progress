"use client"

import { useState } from "react"
import { Camera, ImageIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useHabits } from "@/lib/hooks/useHabits"
import type { HabitType, PriorityLevel } from "@/lib/types/habits"

interface CreateHabitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const UNITS = ["steps", "minutes", "pages", "servings", "glasses", "hours", "reps", "km", "miles"]
const DAYS_OF_WEEK = [
  { key: "M", label: "Mon", index: 0 },
  { key: "T", label: "Tue", index: 1 },
  { key: "W", label: "Wed", index: 2 },
  { key: "Th", label: "Thu", index: 3 },
  { key: "F", label: "Fri", index: 4 },
  { key: "S", label: "Sat", index: 5 },
  { key: "Su", label: "Sun", index: 6 },
]

export function CreateHabitModal({ open, onOpenChange, onSuccess }: CreateHabitModalProps) {
  const { createHabit } = useHabits()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<HabitType | null>(null)
  const [bronzeValue, setBronzeValue] = useState("")
  const [silverValue, setSilverValue] = useState("")
  const [goldValue, setGoldValue] = useState("")
  const [unit, setUnit] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>(["M", "T", "W", "Th", "F"])
  const [shareWithPartner, setShareWithPartner] = useState(true)
  const [requiresPhoto, setRequiresPhoto] = useState(false)
  const [priority, setPriority] = useState<PriorityLevel>("medium")
  const [whyText, setWhyText] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  function toggleDay(key: string) {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    )
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function resetForm() {
    setName("")
    setDescription("")
    setType(null)
    setBronzeValue("")
    setSilverValue("")
    setGoldValue("")
    setUnit("")
    setSelectedDays(["M", "T", "W", "Th", "F"])
    setShareWithPartner(true)
    setRequiresPhoto(false)
    setPriority("medium")
    setWhyText("")
    setPhotoPreview(null)
  }

  async function handleSubmit() {
    if (!canSubmit || !type) return

    setLoading(true)
    try {
      const activeDays = DAYS_OF_WEEK.map((day) => selectedDays.includes(day.key))

      const habit = await createHabit({
        name,
        description: description || undefined,
        type,
        bronze_target: type === "tiered" ? parseInt(bronzeValue) || undefined : undefined,
        silver_target: type === "tiered" ? parseInt(silverValue) || undefined : undefined,
        gold_target: type === "tiered" ? parseInt(goldValue) || undefined : undefined,
        unit: type === "tiered" ? unit || undefined : undefined,
        priority,
        requires_photo: requiresPhoto,
        is_shared: shareWithPartner,
        why_statement: whyText || undefined,
        active_days: activeDays,
      })

      if (habit) {
        resetForm()
        onOpenChange(false)
        onSuccess?.()
      }
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = name.trim() && type

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Basic info */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Info</p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-name">Habit name *</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Morning Workout"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-desc">Description</Label>
              <Textarea
                id="habit-desc"
                placeholder="What does success look like?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
          </section>

          {/* Habit type */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Habit Type *</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("binary")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === "binary"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-card hover:border-border"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type === "binary" ? "bg-primary/10" : "bg-muted"}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={type === "binary" ? "text-primary" : "text-muted-foreground"}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">Binary</span>
                <span className="text-xs text-muted-foreground">Simple yes/no</span>
              </button>
              <button
                onClick={() => setType("tiered")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === "tiered"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/60 bg-card hover:border-border"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type === "tiered" ? "bg-primary/10" : "bg-muted"}`}>
                  <span className="text-lg">{"\ud83c\udfc6"}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Tiered</span>
                <span className="text-xs text-muted-foreground">Bronze / Silver / Gold</span>
              </button>
            </div>
          </section>

          {/* Tiered configuration */}
          {type === "tiered" && (
            <section className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier Values</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { medal: "\ud83e\udd49", label: "Bronze", value: bronzeValue, setter: setBronzeValue },
                  { medal: "\ud83e\udd48", label: "Silver", value: silverValue, setter: setSilverValue },
                  { medal: "\ud83e\udd47", label: "Gold", value: goldValue, setter: setGoldValue },
                ].map((tier) => (
                  <div key={tier.label} className="flex items-center gap-2">
                    <span className="w-6 text-center text-base">{tier.medal}</span>
                    <span className="w-14 text-xs font-medium text-muted-foreground">{tier.label}</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={tier.value}
                      onChange={(e) => tier.setter(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Bronze maintains your streak</p>
            </section>
          )}

          {/* Schedule */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Schedule</p>
            <div className="flex flex-col gap-2">
              <Label>Which days?</Label>
              <div className="flex gap-1.5">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => toggleDay(d.key)}
                    className={`flex h-9 min-w-[36px] flex-1 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      selectedDays.includes(d.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                    aria-label={d.label}
                  >
                    {d.key}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Accountability */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Accountability</p>
            <div className="flex items-center justify-between">
              <Label htmlFor="share-partner" className="cursor-pointer text-sm">Share with partner</Label>
              <Switch id="share-partner" checked={shareWithPartner} onCheckedChange={setShareWithPartner} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="photo-proof" className="cursor-pointer text-sm">Requires photo proof</Label>
              <Switch id="photo-proof" checked={requiresPhoto} onCheckedChange={setRequiresPhoto} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-all ${
                      priority === p
                        ? p === "high"
                          ? "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20"
                          : p === "medium"
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "bg-muted text-foreground ring-1 ring-border"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Your why */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Why</p>
            <Textarea
              placeholder="Why does this matter to you?"
              value={whyText}
              onChange={(e) => setWhyText(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Motivation" className="h-32 w-full rounded-lg object-cover" />
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="absolute right-2 top-2 rounded-full bg-foreground/60 p-1 text-background"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50">
                <Camera className="h-4 w-4" />
                Upload motivation photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            )}
            <p className="text-xs text-muted-foreground">Your partner will see this</p>
          </section>

          {/* Actions */}
          <div className="flex gap-3 border-t border-border/60 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubmit} 
              disabled={!canSubmit || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Habit"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
