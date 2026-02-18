import Link from "next/link"
import { Sparkles, Crown } from "lucide-react"
import AiBackground from "@/components/ai-background"
import ProposalForm from "@/components/proposal-form"

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <AiBackground />

      {/* Crown icon — link to leaderboard */}
      <Link
        href="/leaderboard"
        className="fixed right-6 top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/30 bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-yellow-400/60 hover:bg-yellow-500/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]"
        title="榮譽榜"
      >
        <Crown className="h-5 w-5 text-yellow-400" />
      </Link>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Card outer glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[hsl(252,80%,65%)]/20 to-[hsl(210,90%,55%)]/20 blur-xl" />

        <div className="relative rounded-2xl border border-foreground/[0.08] bg-card/40 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Judge AI知識庫-提案系統
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              提交您的提案，讓 AI 更符合您的需求。
            </p>
          </div>

          {/* Form */}
          <ProposalForm />

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            
          </p>
        </div>
      </div>
    </main>
  )
}
