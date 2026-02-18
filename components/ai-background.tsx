export default function AiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0820] via-[#12082e] to-[#080e24]" />

      {/* Top-left neon glow - purple */}
      <div
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[hsl(270,80%,30%)] blur-[140px]"
        style={{ animation: "glow-pulse 6s ease-in-out infinite" }}
      />

      {/* Bottom-right neon glow - blue */}
      <div
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[hsl(220,80%,25%)] blur-[160px]"
        style={{ animation: "glow-pulse 8s ease-in-out infinite 2s" }}
      />

      {/* Center accent glow */}
      <div
        className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(252,70%,25%)] blur-[120px]"
        style={{ animation: "glow-pulse 7s ease-in-out infinite 1s" }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}
