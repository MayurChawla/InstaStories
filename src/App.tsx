"use client"

import React, { useState, useEffect } from "react"
import StoriesList from "./components/StoriesList"
import StoryViewer from "./components/StoryViewer"
import type { Story } from "./types"

const App: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/data/stories.json")
        const data = await response.json()
        setStories(data)
      } catch (error) {
        console.error("Error fetching stories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  // const openStory = (index: number) => {
  //   const story = stories[index];
  //   // Mark all previous stories as viewed
  //   const newViewedStories = new Set(viewedStories);
  //   for (let i = 0; i <= index; i++) {
  //     newViewedStories.add(`${stories[i].id}-${i}`);
  //   }
  //   setViewedStories(newViewedStories);
  //   setActiveStoryIndex(index);
  // };

  const openStory = (index: number) => {
    const story = stories[index];
    const newViewedStories = new Set(viewedStories);
    
    // Mark all items of the current story as viewed
    story.items.forEach((_, itemIndex) => {
      newViewedStories.add(`${story.id}-${itemIndex}`);
    });
    
    setViewedStories(newViewedStories);
    setActiveStoryIndex(index);
  };
  
  const closeStory = () => {
    setActiveStoryIndex(null)
  }

  return (
    <div className="max-w-screen-md mx-auto p-4 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-serif font-bold">Instagram</h1>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <StoriesList
          stories={stories}
          onStoryClick={openStory}
          viewedStories={viewedStories}
          setViewedStories={setViewedStories}
        />
      )}

      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={closeStory}
          viewedStories={viewedStories}
          setViewedStories={setViewedStories}
        />
      )}
    </div>
  )
}

export default App
