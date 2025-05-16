"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Gift, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function GiftPage() {
  const [isOpened, setIsOpened] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  const handleOpenGift = () => {
    setIsOpened(true)
    setTimeout(() => {
      setIsRevealed(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="container mx-auto py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-purple-700 hover:text-purple-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-8 text-center">Your Special Gift</h1>

        {!isOpened ? (
          <div className="text-center space-y-8">
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
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {isRevealed ? (
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                    <Image src="image.png?height=400&width=300" alt="Gift image" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-2xl font-bold text-purple-800">Chúc mừng Ly nhen!</h2>
                    <p className="text-purple-700">
                      Ly đã đạt được điều tuyệt vời, Đinh Lộc rất tự hào về bạn! Tấm ảnh này trong máy Đinh Lộc suốt bấy lâu nay, Lộc trả Hương Ly
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-purple-800 font-medium">
                        Mong tương lai của Ly tươi sáng. Đây là khởi đầu mới!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Heart className="h-5 w-5 fill-purple-600" />
                      <span>Với tình yêu và niềm tự hào. Thân mến, Đinh Lộc</span>
                    </div>
                  </div>
                </div>
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
      </main>

      <footer className="bg-purple-800 text-purple-100 py-4">
        <div className="container mx-auto text-center">
          <p>Made with ❤️ from Dilo Team</p>
        </div>
      </footer>
    </div>
  )
}
