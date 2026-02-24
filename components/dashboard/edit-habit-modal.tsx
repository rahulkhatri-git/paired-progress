"use client"

import { useState } from "react"
import { X, Loader2, Trash2 } from "lucide-react"
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
import type { PriorityLevel } from "@/lib/types/habits"

interface EditHabitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habitId: string | null
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

export function EditHabitModal({ open, onOpenChange, habitId }: EditHabitModalProps) {
  const { habits, updateHabit, deleteHabit } = useHabits()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [bronzeValue, setBronzeValue] = useState("")
  const [silverValue, setSilverValue] = useState("")
  const [goldValue, setGoldValue] = useState("")
  const [unit, setUnit] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>(["M", "T", "W", "Th", "F"])
  const [shareWithPartner, setShareWithPartner] = useState(true)
  const [requiresPhoto, setRequiresPhoto] = useState(false)
  const [priority, setPriority] = useState<PriorityLevel>("medium")
  const [whyText, setWhyText] = useState("")

  const habit = habits.find((h) => h.id === habitId)

  useEffect(() => {
    if (habit && open) {
      setName(habit.name)
      setDescription(habit.description || "")
      setBronzeValue(habit.bronze_target?.toString() || "")
      setSilverValue(habit.silver_target?.toString() || "")
      setGoldValue(habit.gold_target?.toString() || "")
      setUnit(habit.unit || "")
      setPriority(habit.priority || "medium")
      setRequiresPhoto(habit.requires_photo || false)
      setShareWithPartner(habit.is_shared ?? true)
      setWhyText(habit.why_statement || "")
      
      // Convert active_days array to selected day keys
      if (habit.active_days && Array.isArray(habit.active_days)) {
        const selected = DAYS_OF_WEEK
          .filter((day, idx) => habit.active_days[idx])
          .map((day) => day.key)
        setSelectedDays(selected)
      }
    }
  }, [habit, open])

  function toggleDay(key: string) {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    )
  }

  async function handleSubmit() {
    if (!habitId || !name.trim() || !habit) return

    setLoading(true)
    try {
      const activeDays = DAYS_OF_WEEK.map((day) => selectedDays.includes(day.key))

      const updates: any = {
        id: habitId,
        name,
        description: description || undefined,
        priority,
        requires_photo: requiresPhoto,
        is_shared: shareWithPartner,
        why_statement: whyText || undefined,
        active_days: activeDays,
      }

      if (habit.type === "tiered") {
        updates.bronze_target = parseInt(bronzeValue) || undefined
        updates.silver_target = parseInt(silverValue) || undefined
        updates.gold_target = parseInt(goldValue) || undefined
        updates.unit = unit || undefined
      }

      const result = await updateHabit(updates)
      
      if (result) {
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!habitId) return
    
    if (!confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      const success = await deleteHabit(habitId)
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (!habit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Basic info */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Info</p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-habit-name">Habit name *</Label>
              <Input
                id="edit-habit-name"
                placeholder="e.g., Morning Workout"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-habit-desc">Description</Label>
              <Textarea
                id="edit-habit-desc"
                placeholder="What does success look like?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
          </section>

          {/* Habit type (read-only) */}
          <section className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Habit Type</p>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
              {habit.type === "binary" ? "Binary (Yes/No)" : "Tiered (Bronze/Silver/Gold)"}
              <span className="ml-2 text-xs">(cannot be changed)</span>
            </div>
          </section>

          {/* Tiered configuration */}
          {habit.type === "tiered" && (
            <section className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier Values</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { medal: "🥉", label: "Bronze", value: bronzeValue, setter: setBronzeValue },
                  { medal: "🥈", label: "Silver", value: silverValue, setter: setSilverValue },
                  { medal: "🥇", label: "Gold", value: goldValue, setter: setGoldValue },
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
              <Label htmlFor="edit-share-partner" className="cursor-pointer text-sm">Share with partner</Label>
              <Switch id="edit-share-partner" checked={shareWithPartner} onCheckedChange={setShareWithPartner} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-photo-proof" className="cursor-pointer text-sm">Requires photo proof</Label>
              <Switch id="edit-photo-proof" checked={requiresPhoto} onCheckedChange={setRequiresPhoto} />
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
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => onOpenChange(false)}
                disabled={loading || deleting}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit} 
                disabled={!name.trim() || loading || deleting}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || deleting}
              className="w-full"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Habit
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
