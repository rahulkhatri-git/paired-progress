"use client"

import { useState, useEffect } from "react"
import { X, Camera, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { HabitCardData } from "./habit-card"
import { useHabitLogs } from "@/lib/hooks/useHabitLogs"
import { useHabits } from "@/lib/hooks/useHabits"
import { createClient } from "@/lib/supabase/client"
import { calculateTierAchieved } from "@/lib/utils/habits"
import type { EmotionType, TierAchieved } from "@/lib/types/habits"
import { toast } from "sonner"

interface LogHabitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habitId: string | null
  habits: HabitCardData[]
}

const MOODS = [
  { emoji: "\ud83d\ude2b", label: "Struggled", value: "struggled" },
  { emoji: "\ud83d\ude10", label: "Fine", value: "fine" },
  { emoji: "\ud83d\ude0a", label: "Good", value: "good" },
  { emoji: "\ud83d\udd25", label: "Amazing", value: "amazing" },
]

export function LogHabitModal({ open, onOpenChange, habitId, habits }: LogHabitModalProps) {
  const { createLog, updateLog, deleteLog } = useHabitLogs()
  const { habits: allHabits } = useHabits()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedHabitId, setSelectedHabitId] = useState<string>("")
  const [value, setValue] = useState("")
  const [mood, setMood] = useState<EmotionType | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [tierReached, setTierReached] = useState<TierAchieved>("none")
  const [existingLog, setExistingLog] = useState<any>(null)

  useEffect(() => {
    if (habitId) setSelectedHabitId(habitId)
  }, [habitId])

  const selectedHabit = habits.find((h) => h.id === selectedHabitId)
  const fullHabit = allHabits.find((h) => h.id === selectedHabitId)

  // Check if there's an existing log for today
  useEffect(() => {
    async function checkExistingLog() {
      if (!selectedHabitId || !open) return
      
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', selectedHabitId)
        .eq('log_date', today)
        .maybeSingle()
      
      if (data) {
        setExistingLog(data)
        if (data.value) setValue(data.value.toString())
        if (data.emotion) setMood(data.emotion)
        if (data.photo_url) setPhotoPreview(data.photo_url)
        if (data.tier_achieved) setTierReached(data.tier_achieved)
      } else {
        setExistingLog(null)
      }
    }
    
    checkExistingLog()
  }, [selectedHabitId, open, supabase])

  useEffect(() => {
    if (selectedHabit?.type === "tiered" && value && fullHabit) {
      const num = parseFloat(value)
      setTierReached(calculateTierAchieved(num, fullHabit))
    } else {
      setTierReached("none")
    }
  }, [value, selectedHabit, fullHabit])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  function resetForm() {
    setValue("")
    setMood(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    setTierReached("none")
    setExistingLog(null)
  }

  async function handleDelete() {
    if (!existingLog?.id) return
    
    if (!confirm("Are you sure you want to delete this log?")) {
      return
    }

    setDeleting(true)
    try {
      const success = await deleteLog(existingLog.id)
      if (success) {
        resetForm()
        onOpenChange(false)
      }
    } finally {
      setDeleting(false)
    }
  }

  async function uploadPhoto(file: File, userId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('habit-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          toast.error('Storage bucket not configured. Please create "habit-photos" bucket in Supabase.')
        } else {
          toast.error(`Upload failed: ${error.message}`)
        }
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('habit-photos')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      return null
    }
  }

  async function handleSubmit() {
    if (!selectedHabitId || !fullHabit) return

    setLoading(true)
    try {
      let photoUrl: string | undefined = undefined

      // Upload photo if provided
      if (photoFile) {
        const user = (await supabase.auth.getUser()).data.user
        if (user) {
          const url = await uploadPhoto(photoFile, user.id)
          if (url) photoUrl = url
        }
      } else if (photoPreview && existingLog?.photo_url) {
        // Keep existing photo if no new photo uploaded
        photoUrl = existingLog.photo_url
      }

      const logData: any = {
        habit_id: selectedHabitId,
        emotion: mood || undefined,
        photo_url: photoUrl,
      }

      if (fullHabit.type === 'tiered') {
        logData.value = parseInt(value) || 0
        logData.tier_achieved = tierReached
        logData.completed = tierReached !== 'none'
      } else {
        logData.completed = true
      }

      let result
      if (existingLog) {
        // Update existing log
        result = await updateLog(existingLog.id, logData)
      } else {
        // Create new log
        result = await createLog(logData)
      }
      
      if (result) {
        resetForm()
        onOpenChange(false)
      }
    } finally {
      setLoading(false)
    }
  }

  function TierBar({ label, medal, threshold, isCurrent }: { label: string; medal: string; threshold: number; isCurrent: boolean }) {
    const num = parseFloat(value) || 0
    const progress = Math.min((num / threshold) * 100, 100)
    const reached = num >= threshold

    return (
      <div className="flex items-center gap-3">
        <span className="w-5 text-center text-base">{medal}</span>
        <div className="flex-1">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                reached ? "bg-primary" : "bg-primary/30"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className={`w-20 text-right text-xs font-medium ${reached ? "text-primary" : "text-muted-foreground"}`}>
          {label} ({threshold.toLocaleString()})
        </span>
        {reached && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingLog ? "Edit Habit Log" : "Log Habit"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Habit selector */}
          <div className="flex flex-col gap-2">
            <Label>Select habit</Label>
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a habit..." />
              </SelectTrigger>
              <SelectContent>
                {habits.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.emoji} {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedHabit && (
            <>
              {/* Tiered input */}
              {selectedHabit.type === "tiered" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>Value</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="text-lg font-semibold"
                      />
                      <span className="shrink-0 text-sm font-medium text-muted-foreground">
                        {selectedHabit.unit}
                      </span>
                    </div>
                  </div>

                  {tierReached === "gold" && (
                    <div className="rounded-lg bg-amber-500/10 px-3 py-2 text-center text-sm font-semibold text-amber-600">
                      Gold tier reached!
                    </div>
                  )}

                  <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    {selectedHabit.bronze && (
                      <TierBar
                        label="Bronze"
                        medal={"\ud83e\udd49"}
                        threshold={selectedHabit.bronze}
                        isCurrent={tierReached === "bronze"}
                      />
                    )}
                    {selectedHabit.silver && (
                      <TierBar
                        label="Silver"
                        medal={"\ud83e\udd48"}
                        threshold={selectedHabit.silver}
                        isCurrent={tierReached === "silver"}
                      />
                    )}
                    {selectedHabit.gold && (
                      <TierBar
                        label="Gold"
                        medal={"\ud83e\udd47"}
                        threshold={selectedHabit.gold}
                        isCurrent={tierReached === "gold"}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Binary confirmation */}
              {selectedHabit.type === "binary" && (
                <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Mark as completed
                    </span>
                  </div>
                </div>
              )}

              {/* Photo upload */}
              <div className="flex flex-col gap-2">
                <Label>Photo proof</Label>
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Proof"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setPhotoPreview(null)}
                      className="absolute right-2 top-2 rounded-full bg-foreground/60 p-1 text-background transition-colors hover:bg-foreground/80"
                      aria-label="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50">
                      <Camera className="h-4 w-4" />
                      Take photo
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
                    </label>
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50">
                      <ImageIcon className="h-4 w-4" />
                      Choose file
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                  </div>
                )}
              </div>

              {/* Mood selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>How did you feel?</Label>
                  {mood && (
                    <button
                      onClick={() => setMood(null)}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Skip
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                        mood === m.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 bg-card hover:bg-accent"
                      }`}
                    >
                      <span className={`text-2xl transition-all ${mood === m.value ? "" : "grayscale opacity-50"}`}>
                        {m.emoji}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={loading || deleting}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={!selectedHabitId || loading || deleting}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {existingLog ? "Updating..." : "Logging..."}
                  </>
                ) : (
                  <>{existingLog ? "Update Log" : "Log Habit"}</>
                )}
              </Button>
            </div>
            
            {existingLog && (
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
                  "Delete This Log"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
