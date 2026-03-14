import { useEffect, useRef, useState } from "react"
import AudioPlayer from "./components/AudioPlayer.tsx";
import LRCseperate from "./utils/LRCseperate.ts"
import LyricsDisplay from "./components/LyricsDisplay.tsx";
import type { WordTiming } from "./utils/SplitWords.ts";

const lrcText = `
[00:08.18]I be like fuck it, at the same time I don't say, "Fuck it"
[00:12.18]Now look what I'm stuck with
[00:13.51]I don't care if I'm in the wrong
[00:15.74]I don't get upset
[00:17.07]I don't care if you in the wrong
[00:19.29]I don't get upset
[00:22.38]I be like fuck it, at the same time I know I can't trust it
[00:26.43]Now look what I'm stuck with
[00:27.74]I don't care if I'm in the wrong
[00:29.88]I don't get upset
[00:31.34]I don't care if you in the wrong
[00:33.46]I don't get upset
[00:34.84]
[00:36.83]Hey, hey-hey-hey
[00:40.35]Hey, hey-hey-hey
[00:42.62]
[00:43.70]I like your style, but I know that you're the worst
[00:47.43]Don't judge me
[00:49.68]Lying in my bed, now it's above me
[00:53.02]So don't get it off yo' chest, I know you love me
[00:55.71]Don't judge me now, now, now, me now
[00:59.80]I know it don't matter 'cause you'll dive, you'll dive in
[01:03.78]I don't wanna draw the line
[01:06.54]Darling, you've gone too far, gone too far
[01:10.54]Got your views, got your views
[01:14.40]But I don't really think you got no social cues, oh no
[01:18.13]Hanging up 'round your neck, that's cheap perfume
[01:21.52]I caught it from a thousand miles away
[01:24.44]
[01:26.43]I be like fuck it, at the same time I don't say, "Fuck it"
[01:30.31]Now look what I'm stuck with
[01:31.69]I don't care if I'm in the wrong
[01:33.89]I don't get upset
[01:35.28]I don't care if you in the wrong
[01:37.51]I don't get upset
[01:40.63]I be like fuck it, at the same time I know I can't trust it
[01:44.68]Now look what I'm stuck with
[01:45.94]I don't care if I'm in the wrong
[01:48.09]I don't get upset
[01:49.51]I don't care if you in the wrong
[01:51.68]I don't get upset
[01:53.03]
[01:53.67]I just came back from a flight, feel crazy
[01:55.45]Hope ya lil' mans don't get upset
[01:57.33]Came a long way from them minimum wages
[01:59.08]When I get paid, don't feel nothin'
[02:00.79]I just came back from a flight, feel crazy
[02:02.57]Hope ya lil' mans don't get upset
[02:04.36]Came a long way from them minimum wages
[02:06.12]When I get paid, don't feel nothin'
[02:07.92]I just came back from a flight, feel crazy
[02:09.70]Hope ya lil' mans don't get upset
[02:11.48]Came a long way from them minimum wages
[02:13.27]When I get paid, don't feel nothin'
[02:15.00]I just came back from a flight, feel crazy
[02:16.79]Hope ya lil' mans don't get upset
[02:18.63]Came a long way from them minimum wages
[02:20.40]When I get paid, don't feel nothin'
[02:21.96]
[02:23.33]I be like fuck it, at the same time I don't say, "Fuck it"
[02:27.24]Now look what I'm stuck with
[02:28.63]I don't care if I'm in the wrong
[02:30.76]I don't get upset
[02:32.12]I don't care if you in the wrong
[02:34.38]I don't get upset
[02:37.49]I be like fuck it, at the same time I know I can't trust it
[02:41.47]Now look what I'm stuck with
[02:42.85]I don't care if I'm in the wrong
[02:45.00]I don't get upset
[02:46.44]I don't care if you in the wrong
[02:48.63]I don't get upset
[02:49.91]
`


function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [words, setWords] = useState<WordTiming[]>([]);
  const video = useRef<HTMLVideoElement>(null)
  const [showLyrics, setShowLyrics] = useState(true)
  const [showVideo, setShowVideo] = useState(true)

  const lines = LRCseperate(lrcText);

  useEffect(() => {

    const fetchWords = async () => {
      try {
        const res = await fetch("/lyrics_sync.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWords(data);
      } catch (err) {
        console.error("Failed to load lyrics_word.json:", err);
      }
    };

    fetchWords();

  }, []);

  return (
    <div className="">
      <div className="w-[85vw] mx-auto pt-8">

        <div className="flex justify-between">
          <div className="text-lg font-bold">Monsoon <span className="font-normal text-gray-700">by</span> Tokio Hotel</div>
          <div className="flex gap-5">
            <div onClick={() => {setShowVideo(!showVideo)}} className={`${showVideo ? "underline font-extrabold" : "font-bold"} text-xl cursor-pointer`}>Video</div>
            <div onClick={() => setShowLyrics(!showLyrics)} className={`${showLyrics ? "font-extrabold underline" : "font-bold"} text-xl cursor-pointer`}>CC</div>
          </div>
        </div>

        <div className={`${showLyrics ? "" : "hidden"} absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-5 drop-shadow-[0_2px_20px_rgba(0,0,0,1)]`}>
          <LyricsDisplay words={words} lines={lines} current={currentTime} />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-[40px] overflow-hidden">
          <video muted ref={video} src="upset2.mp4" loop className={`${showVideo ? "" : "hidden"} opacity-20 absolute w-full h-full object-cover object-center`}></video>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-5">
          <AudioPlayer 
            onTimeUpdate={setCurrentTime}
            onPause={video.current ? () => video.current?.pause() : undefined}
            onPlay={video.current ? () => video.current?.play() : undefined}
            onEnd={() => {
              if (video.current) {
                video.current.pause();
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App;
