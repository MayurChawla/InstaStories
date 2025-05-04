InstaStory - A React-based Instagram Story Viewer
Description
InstaStory is a React-based app that mimics the Instagram Stories feature. The app allows users to view stories in a horizontal scrollable list, watch them individually, and navigate through them like the Instagram story UI. The app fetches story data from a local JSON file and displays each story with a thumbnail, username, and timestamp. Upon clicking a story, users can view the story with a progress bar showing the time left in the current story.

Components
1. App (Main component)
The entry point of the app.

Responsible for managing state related to active story index and loading state.

Fetches story data from the /data/stories.json file.

Passes the necessary data to child components: StoriesList and StoryViewer.

2. StoriesList
Displays a horizontally scrollable list of stories.

Each story shows a circular thumbnail with the username beneath it.

Handles the scroll functionality using the mouse wheel for horizontal navigation.

Triggers onStoryClick when a user clicks on a story to view it in full.

3. StoryViewer
Displays the full content of a selected story.

Shows the story's image and relevant metadata (username, timestamp).

Includes a progress bar that fills as the story plays.

Allows the user to navigate to the next or previous story by clicking on the screen (left or right).

Folder Structure
Here’s an overview of the app's folder structure:

/InstaStory
│
├── /src
│   ├── /components
│   │   ├── StoryViewer.tsx        # Displays individual stories
│   │   └── StoriesList.tsx        # Displays the list of stories in a scrollable view
│   │
│   ├── /types
│   │   └── index.ts               # Contains the type definitions, including `Story`
│   │
│   ├── /assets
│   │   └── /data
│   │       └── stories.json       # Sample story data (image, username, timestamp)
│   │
│   ├── App.tsx                    # Main entry point of the app
│   └── index.tsx                   # React entry file that renders the App component
│
├── /public
│   ├── placeholder.svg             # Placeholder image for stories
│   └── index.html                  # HTML file for the app
│
├── /tests
│   └── App.test.tsx                # Test file for the App component
│
├── package.json                    # Project metadata and dependencies
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration file


How to Run the App
1. Install Dependencies
Clone this repository and install the necessary dependencies using npm or yarn:


git clone <repository-url>
cd InstaStory
npm install


2. Run the Development Server
To run the app in development mode, use the following command:
npm run dev

This will start the development server, and you can view the app at http://localhost:5173.

3. Run Tests
You can run the tests using the following command:

npm test


Other Information
Styling: The app uses TailwindCSS for styling. You can customize it in tailwind.config.js.

API: The app doesn't use a backend API, but story data is fetched from a local stories.json file inside the /assets/data directory. You can easily replace this with dynamic data later if needed.

Developer Connect : https://github.com/mayurchawla


