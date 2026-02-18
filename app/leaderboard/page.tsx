"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Crown, Trophy, Medal } from "lucide-react"
import AiBackground from "@/components/ai-background"
import LoadingOverlay from "@/components/loading-overlay"

interface LeaderboardEntry {
  name: string
  count: number
  itemSum: number
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyttyY5F_fcg0F61R9RjKVlnallOhXBkc8Y32nGTcVbxj4wvNzeyuo80DbIrh2cuYPo/exec"
      const res = await fetch(url)
      const json = await res.json()
      if (json.success && json.data) {
        // Count submissions and sum itemNumbers per proposer
        const stats: Record<string, { count: number; itemSum: number }> = {}
        json.data.forEach((row: { proposer: string; itemNumber: number }) => {
          const name = row.proposer.trim()
          if (name) {
            if (!stats[name]) stats[name] = { count: 0, itemSum: 0 }
            stats[name].count += 1
            stats[name].itemSum += Number(row.itemNumber) || 0
          }
        })
        // Sort: count desc, then itemSum asc (lower sum = submitted earlier = ranks higher)
        const sorted = Object.entries(stats)
          .map(([name, s]) => ({ name, count: s.count, itemSum: s.itemSum }))
          .sort((a, b) => b.count - a.count || a.itemSum - b.itemSum)
        setLeaders(sorted)
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err)
    } finally {
      setLoading(false)
    }
  }

  const top3 = leaders.slice(0, 3)
  const rest = leaders.slice(3)

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]]

  const podiumHeights = ["h-32", "h-44", "h-24"]
  const podiumColors = [
    "from-gray-300 to-gray-400",      // 2nd - silver
    "from-yellow-300 to-yellow-500",   // 1st - gold
    "from-amber-600 to-amber-700",     // 3rd - bronze
  ]
  const podiumLabels = ["2nd", "1st", "3rd"]
  const podiumIcons = [
    <Medal key="2" className="h-8 w-8 text-gray-300" />,
    <Trophy key="1" className="h-10 w-10 text-yellow-400" />,
    <Medal key="3" className="h-8 w-8 text-amber-600" />,
  ]

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-12">
      <AiBackground />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Back button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回提案系統
        </Link>

        {/* Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
            <Crown className="h-7 w-7 text-yellow-400" />
          </div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            榮譽榜
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            貢獻最多提案的夥伴
          </p>
        </div>

        {loading && <LoadingOverlay />}

        {!loading && leaders.length === 0 && (
          <div className="rounded-2xl border border-foreground/[0.08] bg-card/40 p-12 text-center backdrop-blur-xl">
            <p className="text-muted-foreground">目前還沒有提案紀錄</p>
          </div>
        )}

        {!loading && leaders.length > 0 && (
          <>
            {/* Olympic Podium */}
            <div className="mb-10 rounded-2xl border border-foreground/[0.08] bg-card/40 p-8 backdrop-blur-xl">
              <div className="flex items-end justify-center gap-4">
                {podiumOrder.map((entry, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {entry ? (
                      <>
                        {/* Icon */}
                        <div className="mb-2">{podiumIcons[i]}</div>
                        {/* Name */}
                        <p className="mb-1 text-sm font-bold text-foreground">
                          {entry.name}
                        </p>
                        {/* Count */}
                        <p className="mb-3 text-xs text-muted-foreground">
                          {entry.count} 題
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="mb-2 opacity-30">{podiumIcons[i]}</div>
                        <p className="mb-1 text-sm font-bold text-muted-foreground/40">
                          —
                        </p>
                        <p className="mb-3 text-xs text-muted-foreground/40">
                          0 題
                        </p>
                      </>
                    )}
                    {/* Podium block */}
                    <div
                      className={`${podiumHeights[i]} w-24 rounded-t-lg bg-gradient-to-t ${podiumColors[i]} flex items-start justify-center pt-3 shadow-lg`}
                    >
                      <span className="text-lg font-extrabold text-white/90 drop-shadow">
                        {podiumLabels[i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full ranking list */}
            {rest.length > 0 && (
              <div className="rounded-2xl border border-foreground/[0.08] bg-card/40 p-6 backdrop-blur-xl">
                <h2 className="mb-4 text-sm font-semibold text-foreground/80">
                  完整排名
                </h2>
                <div className="space-y-2">
                  {rest.map((entry, i) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/30 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {i + 4}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {entry.count} 題
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
