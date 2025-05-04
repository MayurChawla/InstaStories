import React, { useRef } from "react"
import type { Story } from "../types"

interface StoriesListProps {
  stories: Story[]
  onStoryClick: (index: number) => void
  viewedStories: Set<string>
  setViewedStories: React.Dispatch<React.SetStateAction<Set<string>>>
}

const StoriesList: React.FC<StoriesListProps> = ({
  stories,
  onStoryClick,
  viewedStories,
  setViewedStories
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }

  // Group stories by username
  const userStoriesMap = new Map<string, Story[]>()
  stories.forEach(story => {
    if (!userStoriesMap.has(story.username)) {
      userStoriesMap.set(story.username, [])
    }
    userStoriesMap.get(story.username)!.push(story)
  })

  const handleStoryClick = (index: number, storyId: string) => {
    setViewedStories(prev => new Set(prev).add(storyId))
    onStoryClick(index)
  }

  return (
    <div className="flex overflow-x-auto pb-4 hide-scrollbar" ref={scrollContainerRef} onWheel={handleWheel}>
      <div className="flex space-x-4 px-1">
        {[...userStoriesMap.entries()].map(([username, userStories]) => {
          const firstStory = userStories[0]
          const index = stories.findIndex(s => s.id === firstStory.id)

          // Check if ALL stories from this user have been viewed
          const allStoriesViewed = userStories.every(story => 
            story.items.every((_, itemIndex) => 
              viewedStories.has(`${story.id}-${itemIndex}`)
            )
          )

          let borderClass = "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5"
          if (allStoriesViewed) {
            borderClass = "p-0 border-2 border-gray-400"
          }

          return (
            <div key={username} className="flex flex-col items-center cursor-pointer" onClick={() => handleStoryClick(index, firstStory.id)}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${borderClass}`}>
                <div className={`${allStoriesViewed ? 'bg-white' : 'bg-white p-0.5'} rounded-full w-full h-full`}>
                  <img
                    src={firstStory.thumbnail || "/placeholder.svg"}
                    alt={username}
                    className={`w-full h-full object-cover rounded-full ${allStoriesViewed ? 'opacity-80' : ''}`}
                  />
                </div>
              </div>
              <span className={`text-xs mt-1 truncate w-16 text-center ${allStoriesViewed ? 'text-gray-500' : ''}`}>
                {username}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StoriesList
