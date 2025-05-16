"use client"

import { useState, useEffect } from "react"
import Game2048 from "@/components/game-2048"
import GiftReveal from "@/components/gift-reveal"
import PasswordEntry from "@/components/password-entry"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password] = useState("261222") // Fixed password as requested
  const [showPassword, setShowPassword] = useState(false)

  // Simulate loading to ensure game is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleGameComplete = () => {
    setGameCompleted(true)
    setShowPassword(true)
  }

  const handlePasswordSuccess = () => {
    setShowPassword(false)
    // Add a slight delay before showing the gift
    setTimeout(() => {
      setShowGift(true)
    }, 500)
  }

  const handleUnlockGift = () => {
    setShowPassword(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="flex-1 container mx-auto py-6 px-4 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!gameCompleted && !showPassword && !showGift ? (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <Game2048 onGameComplete={handleGameComplete} onUnlockGift={handleUnlockGift} />
              </motion.div>
            ) : showPassword ? (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <PasswordEntry
                  password={password}
                  onPasswordSuccess={handlePasswordSuccess}
                  showGeneratedPassword={gameCompleted}
                />
              </motion.div>
            ) : (
              <motion.div
                key="gift"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-2xl"
              >
                {showGift && <GiftReveal />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      <footer className="bg-purple-800 text-purple-100 py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm">Made with ❤️ from Dilo Team</p>
        </div>
      </footer>
    </div>
  )
}
