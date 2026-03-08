"use client"

import { useState } from "react"
import { Send, Plus, Trash2, CheckCircle2, X } from "lucide-react"
import LoadingOverlay from "@/components/loading-overlay"

interface QuestionEntry {
  id: number
  question: string
  expectedResponse: string
}

export default function ProposalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proposer, setProposer] = useState("")
  const [entries, setEntries] = useState<QuestionEntry[]>([
    { id: Date.now(), question: "", expectedResponse: "" },
  ])
  const [successCount, setSuccessCount] = useState<number | null>(null)

  let nextId = Date.now()
  const genId = () => ++nextId

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: genId(), question: "", expectedResponse: "" },
    ])
  }

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const updateEntry = (id: number, field: "question" | "expectedResponse", value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyttyY5F_fcg0F61R9RjKVlnallOhXBkc8Y32nGTcVbxj4wvNzeyuo80DbIrh2cuYPo/exec"

      const now = new Date()
      const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`

      const rows = entries.map((entry) => ({
        proposer,
        question: entry.question,
        expectedResponse: entry.expectedResponse,
        date,
      }))

      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ rows }),
      })

      setSuccessCount(entries.length)
      setProposer("")
      setEntries([{ id: genId(), question: "", expectedResponse: "" }])
    } catch (err) {
      console.error("Submit error:", err)
      alert("提交失敗，請稍後再試。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    {isSubmitting && <LoadingOverlay />}

    {/* Success Modal */}
    {successCount !== null && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm">
        <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-foreground/[0.08] bg-card/90 p-8 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setSuccessCount(null)}
            className="absolute right-4 top-4 text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">送出成功！</h3>
            <p className="text-sm text-muted-foreground">
              已成功送出 <span className="font-bold text-primary">{successCount}</span> 題提案
            </p>
            <button
              onClick={() => setSuccessCount(null)}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Proposer Name */}
      <div className="space-y-2">
        <label
          htmlFor="proposer"
          className="block text-sm font-medium text-foreground/80 tracking-wide"
        >
          提案人員(英文名)(第一個字母大寫)
        </label>
        <input
          id="proposer"
          type="text"
          required
          value={proposer}
          onChange={(e) => setProposer(e.target.value)}
          placeholder="請輸入英文名"
          className="w-full rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
        />
      </div>

      {/* Question Entries */}
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="relative space-y-4 rounded-xl border border-border/30 bg-muted/20 p-4"
        >
          {/* Entry header with delete button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary/80">
              第 {index + 1} 題
            </span>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                刪除
              </button>
            )}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80 tracking-wide">
              提案問題
            </label>
            <textarea
              required
              rows={3}
              value={entry.question}
              onChange={(e) => updateEntry(entry.id, "question", e.target.value)}
              placeholder="請詳細描述您的提案問題..."
              className="w-full resize-none rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
            />
          </div>

          {/* Expected Response */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground/80 tracking-wide">
              期望得到的答覆或系統面的解決方案
            </label>
            <textarea
              required
              rows={3}
              value={entry.expectedResponse}
              onChange={(e) => updateEntry(entry.id, "expectedResponse", e.target.value)}
              placeholder="請描述您期望的答覆方向..."
              className="w-full resize-none rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
            />
          </div>
        </div>
      ))}

      {/* Add Entry Button */}
      <button
        type="button"
        onClick={addEntry}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        新增題目
      </button>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Glow backdrop */}
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[hsl(252,80%,65%)] to-[hsl(210,90%,55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                處理中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                送出提案（{entries.length} 題）
              </>
            )}
          </span>
        </button>
      </div>
    </form>
    </>
  )
}
