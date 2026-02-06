
## Getting Started
Are you too lazy to swipe on your screen? Do your hands get cold in the cold Berkeley weather? Look no further! You can now use your face to scroll up and down on your computer to scroll, and like reels!

This project is a face-gesture controlled reels interface inspired by the Fallout Pip-Boy + VATS targeting system.
It uses real-time face tracking in the browser to navigate short-form videos hands-free.
No backend. No database. Pure frontend demonstration.

### Getting Started
Install node.js, make sure you install to PATH
Install dependencies
```npm install```

Run dev server
```npm run dev```


Then open on any browser:

```http://localhost:3000```


Allow camera access when prompted.

### System Requirements

You need:

- Node.js 18+

- -npm (comes with Node)

- Webcam (built-in or USB)

- Modern browser (Chrome recommended)


#### Controls (Face Gestures)
Gesture	Action
Nod down --> Next video
Nod up --> Previous video
Tilt left --> Like
Tilt right --> Save
Blink --> Pause / Play
Press D	Toggle debug panel
When debug panel is open, press unmute to hear sounds
When debug panel is open, press recal (recalibrate) to make webcam adapt to your new surroundings

#### Tech Stack

- Next.js (React)

- TypeScript

- MediaPipe Face Landmarker

- WebRTC webcam stream

- Pure frontend (no backend)

- Face tracking runs fully in-browser using MediaPipe.

## Project Structure
/app
  page.tsx                 → main UI
/components
  FaceScrollController.tsx → face tracking + gesture logic
/public/videos             → demo mp4 videos

### Using Your Own Videos

Place .mp4 files inside:

/public/videos/


Then edit app/page.tsx:

const REELS = [
  { id: 1, src: "/videos/yourVideo.mp4" },
];

Refresh browser and they will load.
