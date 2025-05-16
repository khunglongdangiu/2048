"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface GameProps {
  onGameComplete: () => void
  onUnlockGift: () => void
}

// Define the grid size
const GRID_SIZE = 4
const WIN_SCORE = 512 // Changed from 2048 to 512 to make it easier

// Direction constants
const DIRECTIONS = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
}

// Color mapping for tiles
const tileColors: Record<number, string> = {
  2: "bg-purple-100 text-purple-800",
  4: "bg-purple-200 text-purple-800",
  8: "bg-purple-300 text-purple-800",
  16: "bg-purple-400 text-purple-800",
  32: "bg-purple-500 text-white",
  64: "bg-purple-600 text-white",
  128: "bg-purple-700 text-white",
  256: "bg-purple-800 text-white",
  512: "bg-purple-900 text-white",
  1024: "bg-indigo-600 text-white",
  2048: "bg-indigo-700 text-white",
}

export default function Game2048({ onGameComplete, onUnlockGift }: GameProps) {
  const [grid, setGrid] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const isMobile = useMobile()

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0))

    // Add two initial tiles
    addRandomTile(newGrid)
    addRandomTile(newGrid)

    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
  }, [])

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = (grid: number[][]) => {
    const emptyCells = []

    // Find all empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ i, j })
        }
      }
    }

    // If there are empty cells, add a new tile
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      grid[i][j] = Math.random() < 0.9 ? 2 : 4 // 90% chance for 2, 10% chance for 4
    }

    return grid
  }

  // Check if the game is over (no more moves possible)
  const checkGameOver = (grid: number[][]) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return false
      }
    }

    // Check for possible merges horizontally
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        if (grid[i][j] === grid[i][j + 1]) return false
      }
    }

    // Check for possible merges vertically
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === grid[i + 1][j]) return false
      }
    }

    return true
  }

  // Check if the game is won (2048 tile achieved)
  const checkGameWon = (grid: number[][]) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === WIN_SCORE) return true
      }
    }
    return false
  }

  // Move tiles in a direction
  const moveTiles = (direction: string) => {
    if (gameOver || gameWon) return

    let newGrid = JSON.parse(JSON.stringify(grid))
    let moved = false
    let newScore = score

    // Helper function to move a row or column
    const move = (line: number[]) => {
      // Remove zeros
      const nonZeros = line.filter((cell) => cell !== 0)

      // Merge adjacent equal values
      const merged = []
      for (let i = 0; i < nonZeros.length; i++) {
        if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
          const mergedValue = nonZeros[i] * 2
          merged.push(mergedValue)
          newScore += mergedValue
          i++
        } else {
          merged.push(nonZeros[i])
        }
      }

      // Fill the rest with zeros
      const result = merged.concat(Array(GRID_SIZE - merged.length).fill(0))

      // Check if the line has changed
      for (let i = 0; i < GRID_SIZE; i++) {
        if (line[i] !== result[i]) {
          moved = true
          break
        }
      }

      return result
    }

    // Process the grid based on direction
    if (direction === DIRECTIONS.LEFT) {
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = newGrid[i]
        const newRow = move(row)
        newGrid[i] = newRow
      }
    } else if (direction === DIRECTIONS.RIGHT) {
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = newGrid[i].slice().reverse()
        const newRow = move(row).reverse()
        newGrid[i] = newRow
      }
    } else if (direction === DIRECTIONS.UP) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map((row) => row[j])
        const newColumn = move(column)
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newColumn[i]
        }
      }
    } else if (direction === DIRECTIONS.DOWN) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map((row) => row[j]).reverse()
        const newColumn = move(column).reverse()
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newColumn[i]
        }
      }
    }

    // If tiles moved, add a new random tile
    if (moved) {
      newGrid = addRandomTile(newGrid)
      setGrid(newGrid)
      setScore(newScore)

      // Check if game is won
      if (checkGameWon(newGrid)) {
        setGameWon(true)
        onGameComplete()
      }

      // Check if game is over
      if (checkGameOver(newGrid)) {
        setGameOver(true)
      }
    }
  }

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || gameWon) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          moveTiles(DIRECTIONS.UP)
          break
        case "ArrowRight":
          e.preventDefault()
          moveTiles(DIRECTIONS.RIGHT)
          break
        case "ArrowDown":
          e.preventDefault()
          moveTiles(DIRECTIONS.DOWN)
          break
        case "ArrowLeft":
          e.preventDefault()
          moveTiles(DIRECTIONS.LEFT)
          break
        default:
          break
      }
    },
    [gameOver, gameWon, grid, score],
  )

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const xDiff = touchStart.x - touchEnd.x
    const yDiff = touchStart.y - touchEnd.y

    // Determine the direction of the swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (xDiff > 10) {
        moveTiles(DIRECTIONS.LEFT)
      } else if (xDiff < -10) {
        moveTiles(DIRECTIONS.RIGHT)
      }
    } else {
      // Vertical swipe
      if (yDiff > 10) {
        moveTiles(DIRECTIONS.UP)
      } else if (yDiff < -10) {
        moveTiles(DIRECTIONS.DOWN)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Initialize game on component mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // For testing purposes - auto-complete the game
  const completeGameForTesting = () => {
    onGameComplete()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-800 text-transparent bg-clip-text">
              2048
            </h1>
            <p className="text-sm text-purple-600">Merge tiles to reach {WIN_SCORE}!</p>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-md">
            <p className="text-sm text-purple-600">Score</p>
            <p className="text-xl font-bold text-purple-800">{score}</p>
          </div>
        </div>

        <div
          className="bg-purple-50 rounded-lg p-2 mb-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-4 gap-2 aspect-square">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ scale: cell ? 0 : 1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-center rounded-md ${
                    cell ? tileColors[cell] : "bg-purple-200/30"
                  } aspect-square`}
                >
                  {cell > 0 && (
                    <span className={`text-lg md:text-xl font-bold ${cell <= 4 ? "text-purple-800" : "text-white"}`}>
                      {cell}
                    </span>
                  )}
                </motion.div>
              )),
            )}
          </div>
        </div>

        {gameOver && !gameWon && (
          <div className="text-center mb-4">
            <p className="text-red-500 font-bold mb-2">Game Over!</p>
            <Button onClick={initializeGame} className="bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" className="border-purple-300 text-purple-700" onClick={initializeGame}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => onUnlockGift()}>
            Unlock Gift
          </Button>

          {/* Only show for development/testing */}
          {process.env.NODE_ENV === "development" && (
            <Button variant="outline" className="border-purple-300 text-purple-700" onClick={completeGameForTesting}>
              Test Complete
            </Button>
          )}
        </div>

        {isMobile && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div></div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
              onClick={() => moveTiles(DIRECTIONS.UP)}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
              onClick={() => moveTiles(DIRECTIONS.LEFT)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
              onClick={() => moveTiles(DIRECTIONS.RIGHT)}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700"
              onClick={() => moveTiles(DIRECTIONS.DOWN)}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            <div></div>
          </div>
        )}
      </div>

      <div className="text-center text-purple-600 text-sm">
        {isMobile ? "Swipe or use buttons to move tiles" : "Use arrow keys to move tiles"}
      </div>
    </div>
  )
}
