// Update the Story type to include multiple story items per user
export interface StoryItem {
  id: string
  image: string
  timestamp?: string
}

export interface Story {
  id: string
  username: string
  thumbnail: string
  items: StoryItem[]
  viewed?: boolean
}
