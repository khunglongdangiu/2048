"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Heart, GraduationCap, PartyPopper } from "lucide-react"
import Confetti from "@/components/confetti"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GiftReveal() {
  const [isOpened, setIsOpened] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleOpenGift = () => {
    setShowConfetti(true)
    setIsOpened(true)
    setTimeout(() => {
      setIsRevealed(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center">
      {showConfetti && <Confetti />}

      <AnimatePresence>
        {!isOpened ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <motion.div
              className="relative w-64 h-64 mx-auto cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={handleOpenGift}
            >
              <div className="absolute inset-0 bg-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <Gift className="h-24 w-24 text-white" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-purple-400 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-purple-300 rounded-xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-300 pointer-events-none"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-purple-300 pointer-events-none"></div>
            </motion.div>
            <p className="text-purple-700 text-lg">Click the gift to open it!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {isRevealed ? (
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-purple-100 rounded-full p-3">
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-purple-800 mb-8 text-center"
                >
                  Congratulations Graduate!
                </motion.h1>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                    <Image
                      src="placeholder.svg?height=400&width=300"
                      alt="Graduation photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-2xl font-bold text-purple-800">You Did It!</h2>
                    <p className="text-purple-700">
                      I'm so incredibly proud of your achievement! This milestone represents years of dedication, hard
                      work, and perseverance.
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-purple-800 font-medium">
                        May your future be filled with endless opportunities and success. This is just the beginning of
                        an amazing journey ahead!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Heart className="h-5 w-5 fill-purple-600" />
                      <span>With love and pride</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <div className="inline-flex items-center gap-2 text-purple-600">
                    <PartyPopper className="h-5 w-5" />
                    <span className="text-sm">Class of 2025</span>
                    <PartyPopper className="h-5 w-5" />
                  </div>

                  <div className="mt-4">
                    <Link href="/">
                      <Button variant="outline" className="border-purple-300 text-purple-700">
                        Return to Game
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                className="h-64 md:h-80 flex items-center justify-center"
                animate={{
                  rotateY: [0, 180],
                  opacity: [1, 0],
                }}
                transition={{ duration: 1 }}
              >
                <Gift className="h-24 w-24 text-purple-600" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
