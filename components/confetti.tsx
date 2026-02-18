"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: "rect" | "circle"
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [
      "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
      "#F7DC6F", "#BB8FCE", "#85C1E9", "#F0B27A",
      "#FF69B4", "#00CED1", "#FFA500", "#7B68EE",
    ]

    const particles: Particle[] = []

    // Create particles from left side
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: 0,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: Math.random() * 12 + 4,
        vy: Math.random() * -14 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })
    }

    // Create particles from right side
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: -(Math.random() * 12 + 4),
        vy: Math.random() * -14 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })
    }

    let animationId: number
    const gravity = 0.3
    const friction = 0.99

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allDone = true

      for (const p of particles) {
        p.vy += gravity
        p.vx *= friction
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.y > canvas.height * 0.7) {
          p.opacity -= 0.02
        }

        if (p.opacity > 0) {
          allDone = false
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = Math.max(0, p.opacity)
          ctx.fillStyle = p.color

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore()
        }
      }

      if (!allDone) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
    />
  )
}
