"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Unlock, Trophy, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PasswordEntryProps {
  password: string
  onPasswordSuccess: () => void
  showGeneratedPassword: boolean
}

export default function PasswordEntry({ password, onPasswordSuccess, showGeneratedPassword }: PasswordEntryProps) {
  const [inputPassword, setInputPassword] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showSkipOption, setShowSkipOption] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Show skip option after 30 seconds if the user hasn't completed the game
  useEffect(() => {
    if (!showGeneratedPassword) {
      const timer = setTimeout(() => {
        setShowSkipOption(true)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [showGeneratedPassword])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (inputPassword === password) {
      setSuccess(true)
      setError(false)

      // Delay to show success state before proceeding
      setTimeout(() => {
        onPasswordSuccess()
      }, 1000)
    } else {
      setError(true)
      setSuccess(false)

      // Clear input after error
      setTimeout(() => {
        setInputPassword("")
      }, 800)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setInputPassword(value)

    if (error) setError(false)
  }

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="text-center">
        {showGeneratedPassword ? (
          <>
            <CardTitle className="text-2xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              Congratulations!
            </CardTitle>
            <CardDescription className="text-purple-600">
              You've completed the game! Here's your gift access code:
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-2xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <Key className="h-6 w-6 text-purple-600" />
              Enter Gift Access Code
            </CardTitle>
            <CardDescription className="text-purple-600">
              Enter the 6-digit code to unlock your graduation gift
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent>
        {showGeneratedPassword ? (
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-6 gap-2">
                {password.split("").map((digit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="w-10 h-12 flex items-center justify-center bg-purple-100 border-2 border-purple-300 rounded-md"
                  >
                    <span className="text-xl font-bold text-purple-800">{digit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-purple-600">Remember this code to access your gift later!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={inputPassword}
                onChange={handleInputChange}
                className={`text-center text-xl font-bold tracking-widest h-12 ${
                  error ? "border-red-500 bg-red-50" : success ? "border-green-500 bg-green-50" : "border-purple-300"
                }`}
                placeholder="XXXXXX"
                aria-label="Enter 6-digit password"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500">
                Incorrect code. Please try again.
              </motion.p>
            )}

            {showSkipOption && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-purple-600 mt-4"
              >
                Hint: The code is 261222
              </motion.p>
            )}
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        {showGeneratedPassword ? (
          <Button onClick={onPasswordSuccess} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Unlock className="h-4 w-4 mr-2" />
            Unlock Gift
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={inputPassword.length !== 6}
          >
            <Lock className="h-4 w-4 mr-2" />
            Unlock Gift
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
