"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ProposalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    proposer: "",
    question: "",
    expectedResponse: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyttyY5F_fcg0F61R9RjKVlnallOhXBkc8Y32nGTcVbxj4wvNzeyuo80DbIrh2cuYPo/exec"

      const now = new Date()
      const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`

      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          proposer: formData.proposer,
          question: formData.question,
          expectedResponse: formData.expectedResponse,
          date,
        }),
      })

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      setFormData({ proposer: "", question: "", expectedResponse: "" })
    } catch (err) {
      console.error("Submit error:", err)
      alert("提交失敗，請稍後再試。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
          value={formData.proposer}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, proposer: e.target.value }))
          }
          placeholder="請輸入英文名"
          className="w-full rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
        />
      </div>

      {/* Proposal Question */}
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-foreground/80 tracking-wide"
        >
          提案問題
        </label>
        <textarea
          id="question"
          required
          rows={4}
          value={formData.question}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, question: e.target.value }))
          }
          placeholder="請詳細描述您的提案問題..."
          className="w-full resize-none rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
        />
      </div>

      {/* Expected Response */}
      <div className="space-y-2">
        <label
          htmlFor="expectedResponse"
          className="block text-sm font-medium text-foreground/80 tracking-wide"
        >
          期望得到的答覆
        </label>
        <textarea
          id="expectedResponse"
          required
          rows={4}
          value={formData.expectedResponse}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              expectedResponse: e.target.value,
            }))
          }
          placeholder="請描述您期望的答覆方向..."
          className="w-full resize-none rounded-lg border border-border/50 bg-muted/40 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-border/80"
        />
      </div>

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
            ) : submitted ? (
              <>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                提交成功
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                送出提案
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  )
}
