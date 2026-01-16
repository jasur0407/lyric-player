import { useState } from "react"
import AudioPlayer from "./components/AudioPlayer.tsx";
import LRCseperate from "./utils/LRCseperate.ts"
import LyricsDisplay from "./components/LyricsDisplay.tsx";
import { SplitWords, type WordTiming } from "./utils/SplitWords.ts";

const lrcText = `
[00:13.93](Oh-oh)
[00:16.36](Oh-oh)
[00:18.96](Oh-oh)
[00:21.49](Oh-oh)
[00:22.44]
[00:23.21]Du stehst auf
[00:24.57]Und kriegst gesagt wohin du gehen sollst
[00:28.15]Wenn du da bist
[00:29.78]Hörst du auch noch was du denken sollst
[00:32.74]
[00:33.37]Danke
[00:34.73]Das war mal wieder echt 'n geiler Tag
[00:38.32]Du sagst nichts
[00:39.83]Und keiner fragt dich, sag mal willst du das?
[00:43.57]
[00:43.67]Nein, nein, nein, na-na-na-na, nein
[00:46.31]Nein, nein, nein, na-na-na-na, nein
[00:48.83]
[00:48.86]Schrei
[00:50.12]Bis du du selbst bist
[00:51.44]Schrei
[00:52.65]Und wenn es das Letzte ist
[00:54.01]Schrei
[00:55.15]Auch wenn es weh tut
[00:56.55]Schrei so laut du kannst
[00:58.66]
[00:58.86]Schrei
[01:00.29]Bis du du selbst bist
[01:01.67]Schrei
[01:02.78]Und wenn es das Letzte ist
[01:04.20]Schrei
[01:05.30]Auch wenn es weh tut
[01:06.71]Schrei so laut du kannst

`


function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const lines = LRCseperate(lrcText);
  const getAllWords = (lines: {time: number, text: string}[]) : WordTiming[] => {
    const allWords: WordTiming[] = []

    for(let i = 0; i < lines.length; i++) {
      const start = lines[i].time
      const end = lines[i + 1]?.time ?? start + 5
      allWords.push(...SplitWords(lines[i].text, start, end))
    }

    return allWords
  }

  const words = getAllWords(lines)

  return (
    <div>
      <AudioPlayer onTimeUpdate={setCurrentTime}/>
      
      <LyricsDisplay words={words} lines={lines} current={currentTime}/>
    </div>
  )
}

export default App;
