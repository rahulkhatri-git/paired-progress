import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Paired Progress",
  description: "Track your habits together with your partner.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
