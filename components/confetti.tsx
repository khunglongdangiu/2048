"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  speed: number
}

export default function Confetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Create confetti pieces
    const colors = ["#9333ea", "#fcd34d", "#f472b6", "#60a5fa", "#34d399"]
    const newConfetti: ConfettiPiece[] = []

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100, // percentage of screen width
        y: -10 - Math.random() * 100, // start above the screen
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 1,
      })
    }

    setConfetti(newConfetti)

    // Cleanup
    return () => {
      setConfetti([])
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${5 / piece.speed}s linear forwards`,
          }}
        />
      ))}
    </div>
  )
}
