"use client"

import { useState, useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function StepMotivation() {
  const [why, setWhy] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleRemovePhoto() {
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Your motivation
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Write down why this matters to you. Upload a photo that inspires you both to keep going.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Why textarea */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="why-text">Why are you starting this habit?</Label>
          <Textarea
            id="why-text"
            placeholder="We want to get healthier together and support each other's goals. Running in the morning helps us start the day with energy and purpose..."
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            className="min-h-32 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This will be visible to your partner for motivation
          </p>
        </div>

        {/* Photo upload */}
        <div className="flex flex-col gap-2">
          <Label>Motivation photo (optional)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="motivation-photo"
          />

          {photoPreview ? (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img
                src={photoPreview}
                alt="Motivation photo preview"
                className="h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="motivation-photo"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/80 bg-card px-6 py-10 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Upload a photo
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  A goal photo, a selfie together, or anything that keeps you motivated
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Inspirational quote */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
          <p className="text-sm italic leading-relaxed text-foreground/80">
            {'"The secret to getting ahead is getting started together."'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {"- Your journey starts now"}
          </p>
        </div>
      </div>
    </div>
  )
}
