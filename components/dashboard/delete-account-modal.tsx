"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userId: string
}

export function DeleteAccountModal({ isOpen, onClose, userEmail, userId }: DeleteAccountModalProps) {
  const router = useRouter()
  const supabase = createClient()
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:23',message:'DELETE START',data:{confirmText,userId,userEmail},timestamp:Date.now(),hypothesisId:'H1,H2,H3'})}).catch(()=>{});
    // #endregion

    if (confirmText !== "DELETE") {
      toast.error('Please type DELETE to confirm')
      return
    }

    setDeleting(true)

    try {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:33',message:'Deleting profile from DB',data:{userId},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion

      // Delete profile (cascades to all related data: habits, logs, partnerships, etc.)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:38',message:'Profile delete result',data:{hasError:!!deleteError,errorCode:deleteError?.code,errorMsg:deleteError?.message},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion

      if (deleteError) throw deleteError

      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:41',message:'Deleting auth user',data:{userId},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      // Delete the auth user account
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId)

      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:44',message:'Auth delete result',data:{hasError:!!authDeleteError,errorCode:authDeleteError?.code,errorMsg:authDeleteError?.message},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      // If auth delete fails, just log it but continue (profile is already deleted)
      if (authDeleteError) {
        console.error('Failed to delete auth user (requires service role key):', authDeleteError)
      }

      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:52',message:'Signing out',data:{},timestamp:Date.now(),hypothesisId:'H3,H4'})}).catch(()=>{});
      // #endregion

      // Sign out and redirect
      await supabase.auth.signOut()
      
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:56',message:'SUCCESS - redirecting',data:{},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      toast.success('Account deleted successfully')
      router.push('/')
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'delete-account-modal.tsx:64',message:'CATCH - error thrown',data:{errorMsg:error.message,errorCode:error.code},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-destructive/50 bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Delete Account</h2>
        </div>

        <div className="mb-6 space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-destructive">This action is permanent and cannot be undone.</strong>
          </p>
          <p>
            Deleting your account will immediately remove:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Your profile and account ({userEmail})</li>
            <li>All your habits and logs</li>
            <li>Your partnership (if active)</li>
            <li>All your invitations</li>
            <li>Your monthly scores and stats</li>
          </ul>
          <p className="text-xs">
            <strong>Note:</strong> Your partner will be notified and their data will remain intact.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirm-delete" className="mb-2 block text-sm font-medium text-foreground">
            Type <span className="font-mono text-destructive">DELETE</span> to confirm:
          </label>
          <input
            id="confirm-delete"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
            disabled={deleting}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting || confirmText !== "DELETE"}
            className="flex-1 gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Account
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
