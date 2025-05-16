"use client"

import { useEffect, useRef, useState } from "react"

interface GameCanvasProps {
  onGameOver: (score: number) => void
  onScoreUpdate: (score: number) => void
}

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  speed?: number
}

interface Character extends GameObject {
  velocityY: number
  gravity: number
  jumpStrength: number
  isJumping: boolean
}

interface Obstacle extends GameObject {
  passed: boolean
}

interface Collectible extends GameObject {
  collected: boolean
}

const GAME_HEIGHT = 400
const GAME_WIDTH = 800
const GROUND_HEIGHT = 50
const OBSTACLE_WIDTH = 50
const OBSTACLE_GAP = 200
const COLLECTIBLE_SIZE = 30

export default function GameCanvas({ onGameOver, onScoreUpdate }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const gameRef = useRef({
    isRunning: true,
    frameCount: 0,
    character: {
      x: 100,
      y: GAME_HEIGHT - GROUND_HEIGHT - 50,
      width: 40,
      height: 50,
      velocityY: 0,
      gravity: 0.6,
      jumpStrength: -12,
      isJumping: false,
    } as Character,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    lastObstacleTime: 0,
    lastCollectibleTime: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = GAME_WIDTH
    canvas.height = GAME_HEIGHT

    // Handle jump
    const handleJump = () => {
      const { character } = gameRef.current
      if (!character.isJumping) {
        character.velocityY = character.jumpStrength
        character.isJumping = true
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        handleJump()
      }
    }

    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault()
      handleJump()
    }

    window.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleTouch)
    canvas.addEventListener("touchstart", handleTouch)

    // Game loop
    let animationFrameId: number

    const gameLoop = () => {
      if (!gameRef.current.isRunning) return

      update()
      render()
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    const update = () => {
      const { character, obstacles, collectibles, frameCount } = gameRef.current

      // Update frame count
      gameRef.current.frameCount++

      // Update character
      character.velocityY += character.gravity
      character.y += character.velocityY

      // Ground collision
      if (character.y > GAME_HEIGHT - GROUND_HEIGHT - character.height) {
        character.y = GAME_HEIGHT - GROUND_HEIGHT - character.height
        character.velocityY = 0
        character.isJumping = false
      }

      // Generate obstacles
      if (frameCount % 100 === 0) {
        const height = Math.random() * 100 + 50
        obstacles.push({
          x: GAME_WIDTH,
          y: GAME_HEIGHT - GROUND_HEIGHT - height,
          width: OBSTACLE_WIDTH,
          height: height,
          speed: 5,
          passed: false,
        })
      }

      // Generate collectibles (graduation caps)
      if (frameCount % 150 === 0) {
        collectibles.push({
          x: GAME_WIDTH,
          y: Math.random() * (GAME_HEIGHT - GROUND_HEIGHT - COLLECTIBLE_SIZE * 2) + 50,
          width: COLLECTIBLE_SIZE,
          height: COLLECTIBLE_SIZE,
          speed: 5,
          collected: false,
        })
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i]
        obstacle.x -= obstacle.speed || 5

        // Check if passed
        if (!obstacle.passed && obstacle.x + obstacle.width < character.x) {
          obstacle.passed = true
          setScore((prevScore) => {
            const newScore = prevScore + 1
            onScoreUpdate(newScore)
            return newScore
          })
        }

        // Remove if off screen
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(i, 1)
        }

        // Collision detection
        if (
          character.x < obstacle.x + obstacle.width &&
          character.x + character.width > obstacle.x &&
          character.y < obstacle.y + obstacle.height &&
          character.y + character.height > obstacle.y
        ) {
          gameOver()
        }
      }

      // Update collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i]
        collectible.x -= collectible.speed || 5

        // Remove if off screen
        if (collectible.x + collectible.width < 0) {
          collectibles.splice(i, 1)
        }

        // Collision detection for collection
        if (
          !collectible.collected &&
          character.x < collectible.x + collectible.width &&
          character.x + character.width > collectible.x &&
          character.y < collectible.y + collectible.height &&
          character.y + character.height > collectible.y
        ) {
          collectible.collected = true
          collectibles.splice(i, 1)
          setScore((prevScore) => {
            const newScore = prevScore + 2
            onScoreUpdate(newScore)
            return newScore
          })
        }
      }
    }

    const render = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

      // Draw sky background
      ctx.fillStyle = "#e0f2fe"
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT - GROUND_HEIGHT)

      // Draw ground
      ctx.fillStyle = "#7c3aed"
      ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT)

      // Draw character
      const { character } = gameRef.current
      ctx.fillStyle = "#9333ea"
      ctx.fillRect(character.x, character.y, character.width, character.height)

      // Draw graduation cap on character
      ctx.fillStyle = "#000000"
      ctx.fillRect(character.x, character.y - 10, character.width, 10)
      ctx.fillRect(character.x + 10, character.y - 15, 20, 5)

      // Draw obstacles
      ctx.fillStyle = "#7e22ce"
      gameRef.current.obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      })

      // Draw collectibles (graduation caps)
      gameRef.current.collectibles.forEach((collectible) => {
        // Draw cap
        ctx.fillStyle = "#000000"
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height / 2)

        // Draw tassel
        ctx.fillStyle = "#fcd34d"
        ctx.fillRect(collectible.x + collectible.width - 5, collectible.y, 5, collectible.height)
      })
    }

    const gameOver = () => {
      gameRef.current.isRunning = false
      cancelAnimationFrame(animationFrameId)
      onGameOver(score)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleTouch)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [onGameOver, onScoreUpdate, score])

  return <canvas ref={canvasRef} className="w-full h-auto bg-blue-50" style={{ maxHeight: "400px" }} />
}
