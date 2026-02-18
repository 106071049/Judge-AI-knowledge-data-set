"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function LoadingOverlay() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const images = ["/images/louis-1.png", "/images/louis-2.png"]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-32 w-32">
          <Image
            src={images[frame]}
            alt="Loading"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm font-medium text-foreground/80">
          加載中，請稍等幾秒...
        </p>
      </div>
    </div>
  )
}
