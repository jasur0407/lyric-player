import { useState } from "react";
import { parseLRC } from "./utils/parseLRC";
import type { WordTiming } from "./utils/splitLineToWords";
import { splitLineToWords } from "./utils/splitLineToWords";
import LyricsDisplay from "./components/LyricsDisplay";
import AudioPlayer from "./components/AudioPlayer";

// Sample LRC (replace with your song's lyrics)
const lrcText = `
[00:09.84]I'm staring at a broken door
[00:14.18]  
[00:18.69]My room is cold, it's making me insane
[00:27.32]I've been waiting here so long
[00:31.55]Another moment seems to have come
[00:35.92]I see the dark clouds coming up again
[00:40.89]
[00:42.03]Running through the monsoon
[00:44.51]Beyond the world to the end of time
[00:48.24]Where the rain won't hurt
[00:51.00]Fighting the storm into the blue
[00:55.07]And when I lose myself I think of you
[00:59.04]Together we'll be running somewhere new
[01:04.03]Through the monsoon
[01:08.23]Just me and you
[01:12.26]
[01:14.07]A half moon fading from my sight
[01:18.73]I see your vision in its light
[01:23.00]But now it's gone and left me so alone
[01:31.27]I know I have to find you now
[01:35.79]Can't hear your name, I don't know how
[01:40.06]Why can't we make this darkness feel like home?
[01:45.92]
[01:46.26]Running through the monsoon
`;

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  // Parse lines
  const lines = parseLRC(lrcText);

  // Convert all lines to word-level timings
  const getAllWords = (lines: { time: number; text: string }[]): WordTiming[] => {
    const allWords: WordTiming[] = [];
    for (let i = 0; i < lines.length; i++) {
      const start = lines[i].time;
      const end = lines[i + 1]?.time ?? start + 5; // fallback duration for last line
      allWords.push(...splitLineToWords(lines[i].text, start, end));
    }
    return allWords;
  };

  const words = getAllWords(lines);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black p-6">
      {/* Audio player */}
      <AudioPlayer onTimeUpdate={setCurrentTime} />

      {/* Lyrics display */}
      <LyricsDisplay words={words} lines={lines} currentTime={currentTime} />
    </div>
  );
}

export default App;
