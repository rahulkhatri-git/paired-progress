"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Download,
  Users,
  Clock,
  Lock,
  AlertTriangle,
  Minus,
  Plus,
  LogOut,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ProfileSettingsProps {
  onBack: () => void
}

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [partnerAlerts, setPartnerAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [reminderTime, setReminderTime] = useState("08:00")
  const [forgivenessPerWeek, setForgivenessPerWeek] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [showPartnerPrivate, setShowPartnerPrivate] = useState(false)

  // Load profile settings from database
  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setDailyReminders(data.notification_daily_reminders ?? true)
          setPartnerAlerts(data.notification_partner_activity ?? true)
          setWeeklySummary(data.notification_weekly_summary ?? true)
          setForgivenessPerWeek(data.forgiveness_days_per_week ?? 1)
        }
      } catch (error: any) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user?.id])

  // Update profile in database
  async function updateProfile(updates: Record<string, any>) {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      toast.success('Settings saved!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Failed to save settings')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
    }
  }

  // Export user data as JSON
  async function handleExportData() {
    if (!user) return

    try {
      // Fetch all user data
      const [habitsRes, logsRes, profileRes] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', user.id),
        supabase.from('habit_logs').select('*').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])

      const exportData = {
        profile: profileRes.data,
        habits: habitsRes.data || [],
        logs: logsRes.data || [],
        exported_at: new Date().toISOString(),
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `paired-progress-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully!')
    } catch (error: any) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 md:px-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-bold text-foreground">Profile &amp; Settings</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6">
          {/* Profile header */}
          <div className="flex flex-col items-center gap-3 py-4">
            <button className="group relative" aria-label="Change profile photo">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
                A
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 transition-colors group-hover:bg-foreground/10">
                <span className="text-xs font-medium text-foreground/0 transition-colors group-hover:text-foreground">Edit</span>
              </div>
            </button>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user?.user_metadata?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>

          {/* Partnership card */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-600">
                S
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Linked with Sarah</p>
                <p className="text-xs text-muted-foreground">Together for 23 days</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                View Partnership Stats
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Manage Partnership
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Notifications</h2>
            </div>
            <div className="rounded-xl border border-border/60 bg-card">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
                <Label htmlFor="daily-reminders" className="text-sm text-foreground cursor-pointer">Daily reminders</Label>
                <Switch 
                  id="daily-reminders" 
                  checked={dailyReminders} 
                  onCheckedChange={(val) => {
                    setDailyReminders(val)
                    updateProfile({ notification_daily_reminders: val })
                  }} 
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
                <Label htmlFor="partner-alerts" className="text-sm text-foreground cursor-pointer">Partner activity alerts</Label>
                <Switch 
                  id="partner-alerts" 
                  checked={partnerAlerts} 
                  onCheckedChange={(val) => {
                    setPartnerAlerts(val)
                    updateProfile({ notification_partner_activity: val })
                  }} 
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
                <Label htmlFor="weekly-summary" className="text-sm text-foreground cursor-pointer">Weekly summary</Label>
                <Switch 
                  id="weekly-summary" 
                  checked={weeklySummary} 
                  onCheckedChange={(val) => {
                    setWeeklySummary(val)
                    updateProfile({ notification_weekly_summary: val })
                  }} 
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Reminder time</span>
                </div>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
                />
              </div>
            </div>
          </section>

          {/* Forgiveness */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Forgiveness Settings</h2>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                Forgiveness days let you skip habits without breaking streaks. Use them wisely.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Days per week</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      const newValue = Math.max(0, forgivenessPerWeek - 1)
                      setForgivenessPerWeek(newValue)
                      updateProfile({ forgiveness_days_per_week: newValue })
                    }}
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-bold text-foreground">{forgivenessPerWeek}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      const newValue = Math.min(3, forgivenessPerWeek + 1)
                      setForgivenessPerWeek(newValue)
                      updateProfile({ forgiveness_days_per_week: newValue })
                    }}
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-primary/5 px-3 py-2">
                <p className="text-xs font-medium text-primary">
                  This week: {forgivenessPerWeek} remaining
                </p>
              </div>
            </div>
          </section>

          {/* Display */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Display</h2>
            </div>
            <div className="rounded-xl border border-border/60 bg-card">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
                <Label htmlFor="dark-mode" className="text-sm text-foreground cursor-pointer">Dark mode</Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label htmlFor="show-private" className="text-sm text-foreground cursor-pointer">
                    {"Show partner's private habits"}
                  </Label>
                </div>
                <Switch id="show-private" checked={showPartnerPrivate} onCheckedChange={setShowPartnerPrivate} />
              </div>
            </div>
          </section>

          {/* Data & Privacy */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Data &amp; Privacy</h2>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={handleExportData}
              >
                Export My Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                disabled
              >
                Download Partnership Data
              </Button>
            </div>
          </section>

          {/* Danger zone */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-destructive">Danger Zone</h2>
            </div>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
              <div>
                <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Unlink Partnership
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  This will convert all shared habits to private habits.
                </p>
              </div>
              <div className="border-t border-border/40 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
