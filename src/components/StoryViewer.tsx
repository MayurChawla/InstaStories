"use client"

import type React from "react"
import { useState, useEffect, useRef, type TouchEvent } from "react"
import type { Story } from "../types"

interface StoryViewerProps {
  stories: Story[]
  initialIndex: number
  onClose: () => void
  viewedStories: Set<string>
  setViewedStories: React.Dispatch<React.SetStateAction<Set<string>>>
}

const StoryViewer: React.FC<StoryViewerProps> = ({ 
  stories, 
  initialIndex, 
  onClose, 
  viewedStories,
  setViewedStories 
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  const storyDuration = 5000 // 5 seconds

  const currentUser = stories[currentUserIndex]
  const currentStory = currentUser.items[currentStoryIndex]

  // Clear all timers
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Handle touch events for swiping between users
  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return
  
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
  
    // Reset touch position
    touchStartXRef.current = null
  
    // Only handle horizontal swipes
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextUser()
      } else {
        goToPrevUser()
      }
    }
  }

  // Start the progress timer
  const startProgressTimer = () => {
    const startTime = Date.now()
    
    // Clear any existing interval first
    clearTimers()
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / storyDuration) * 100
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearTimers()
        goToNextStory()
      }
    }, 100)

    // Set timeout as backup in case interval fails
    timerRef.current = setTimeout(() => {
      clearTimers()
      goToNextStory()
    }, storyDuration)
  }

  // Navigate to previous story of the same user
  const goToPrevStory = () => {
    clearTimers()
    setProgress(0)
  
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else if (currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1
      const prevUserStoriesCount = stories[prevUserIndex].items.length
      setCurrentUserIndex(prevUserIndex)
      setCurrentStoryIndex(prevUserStoriesCount - 1)
    }
  }
  
  // Navigate to next story or next user
  const goToNextStory = () => {
    clearTimers()
    setProgress(0)
  
    if (currentStoryIndex < currentUser.items.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1)
      setCurrentStoryIndex(0)
    } else {
      onClose()
    }
  }

  // Navigate to next user's stories
  const goToNextUser = () => {
    clearTimers()
    setProgress(0)
    
    if (currentUserIndex < stories.length - 1) {
      const nextUserIndex = currentUserIndex + 1
      const nextUser = stories[nextUserIndex]
      
      // Find first unviewed story index
      const firstUnviewedIndex = nextUser.items.findIndex(
        (_, index) => !viewedStories.has(`${nextUser.id}-${index}`)
      )
      
      setCurrentUserIndex(nextUserIndex)
      setCurrentStoryIndex(firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0)
    } else {
      onClose()
    }
  }
  
  // Navigate to previous user's stories
  const goToPrevUser = () => {
    clearTimers()
    setProgress(0)
    
    if (currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1
      const prevUser = stories[prevUserIndex]
      
      // Find first unviewed story index
      const firstUnviewedIndex = prevUser.items.findIndex(
        (_, index) => !viewedStories.has(`${prevUser.id}-${index}`)
      )
      
      setCurrentUserIndex(prevUserIndex)
      setCurrentStoryIndex(firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0)
    } else {
      onClose()
    }
  }

  // Handle tap events for navigation
  const handleTap = (e: React.MouseEvent) => {
    const { clientX, currentTarget } = e
    const { left, width } = currentTarget.getBoundingClientRect()
    const relativeX = clientX - left
  
    // Left third - previous story/user
    if (relativeX < width / 3) {
      goToPrevStory()
    } 
    // Right third - next story/user
    else if (relativeX > (width * 2) / 3) {
      goToNextStory()
    }
    // Middle third - could implement pause/play here later
  }

  // Load image and start timer
  useEffect(() => {
    // Mark current story as viewed
    setViewedStories(prev => {
      const newSet = new Set(prev)
      newSet.add(`${currentUser.id}-${currentStoryIndex}`)
      return newSet
    })

    // Clear existing timers and reset state
    clearTimers()
    setLoading(true)
    setProgress(0)

    const img = new Image()
    img.src = currentStory.image
    
    img.onload = () => {
      setLoading(false)
      startProgressTimer()
    }

    img.onerror = () => {
      setLoading(false)
      startProgressTimer() // Start timer even if image fails to load
    }

    return () => {
      clearTimers()
    }
  }, [currentUserIndex, currentStoryIndex, currentStory.image, currentUser.id])

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center p-4 text-white z-10">
        <div className="flex items-center flex-1">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5">
            <img
              src={currentUser.thumbnail || "/placeholder.svg"}
              alt={currentUser.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{currentUser.username}</span>
            <span className="text-xs opacity-70">{currentStory.timestamp}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white text-2xl" aria-label="Close story">
          ✕
        </button>
      </div>

      {/* Progress bars */}
      <div className="flex w-full px-2 gap-1 absolute top-0 z-10">
        {currentUser.items.map((_, index) => (
          <div key={index} className="h-0.5 bg-gray-500/50 flex-1 rounded-full overflow-hidden">
            {index === currentStoryIndex && (
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            )}
            {index < currentStoryIndex && <div className="h-full bg-white w-full"></div>}
          </div>
        ))}
      </div>

      {/* Story content */}
      <div className="flex-1 flex items-center justify-center" onClick={handleTap}>
        {loading ? (
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={currentStory.image || "/placeholder.svg"}
              alt={currentUser.username}
              className="w-full h-full object-contain transition-opacity duration-300"
            />
            {currentStory.timestamp && (
              <div className="absolute bottom-4 right-4 bg-black/30 text-white px-2 py-1 rounded text-sm">
                {currentStory.timestamp}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryViewer