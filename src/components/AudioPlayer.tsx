import { useEffect, useRef, useState } from "react"
import { numberToFormat } from "../utils/TimeFormatter"

type Props = {
    onTimeUpdate: (time: number) => void
    onPlay? : () => void
    onPause? : () => void
    onEnd? : () => void
}

export default function AudioPlayer({onTimeUpdate, onPlay, onPause, onEnd} : Props) {
    const audioRef = useRef<HTMLAudioElement>(null)

    //Scroll bar variables
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    //Volume and mute variables
    const [volume, setVolume] = useState(100)
    const [isMuted, setIsMuted] = useState(false)
    const [prevVolume, setPrevVolume] = useState(100)

    // Scroll bar action handlings
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    const handlePlayPause = () => {
        if(!audioRef.current) return
        if (isPlaying === true) {
            audioRef.current.pause()
            setIsPlaying(false)
            if(typeof onPause === "function") {
                onPause()
            }
        } else {
            audioRef.current.play()
            setIsPlaying(true)
            if(typeof onPlay === "function") {
                onPlay()
            }
        }
    } 

    // Volume actions handling
    const handVolumeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value)
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100
            setVolume(newVolume)
            if (newVolume === 0) {
                setIsMuted(true)
            } else {
                setIsMuted(false)
                setPrevVolume(newVolume)
            }
        }
    }

    const handleVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return("/res/noVolume.svg")
        } else if (volume <= 33) {
            return("res/littleVolume.svg")
        } else if (volume <= 66) {
            return("res/midVolume.svg")
        } else {
            return("res/fullVolume.svg")
        }
    }

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (!isMuted) {
            setPrevVolume(volume);
            setVolume(0);
            audioRef.current.volume = 0;
            setIsMuted(true);
        } else {
            setVolume(prevVolume);
            audioRef.current.volume = prevVolume / 100;
            setIsMuted(false);
        }
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            onTimeUpdate(audio.currentTime)
            setCurrentTime(audio.currentTime)
        }

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        }

        const handleEnded = () => {
            setIsPlaying(false);
            if (typeof onPause === 'function') onPause();
            if (typeof onEnd === 'function') onEnd();
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [onTimeUpdate, onPause, onEnd])

    return (
        <div>

            <audio className="hidden" controls src="/song.m4a" ref={audioRef}></audio>
            <div className="relative w-[500px] flex items-center h-8 mx-auto mt-5">
                <input 
                type="range" 
                min={0} 
                max={duration} 
                onChange={handleSeek} 
                value={currentTime} 
                style={{
                    background: `linear-gradient(to right, black 0%, black ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                }}
                className="w-full appearance-none h-[3px] rounded-full cursor-pointer transition-all
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-[10px]
                    [&::-webkit-slider-thumb]:w-[10px]
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-[2px]
                    [&::-webkit-slider-thumb]:border-black
                    [&::-webkit-slider-thumb]:shadow-md
                "
                />
            </div>
            <div className="flex w-[100%] items-center justify-center gap-1 relative">
                <h1 className="text-xs absolute left-15 font-medium text-gray-500">{numberToFormat(currentTime)}/{numberToFormat(duration)}</h1>

                <img src="/res/prev-btn.svg" alt="prev" className="cursor-pointer w-8 rounded-full drop-shadow-sm drop-shadow-gray-300" />
                <img className="cursor-pointer w-8 rounded-full drop-shadow-sm drop-shadow-gray-300" onClick={handlePlayPause} src={isPlaying ? "/res/pause-btn.svg" : "/res/play-btn.svg"} alt="play/pause" />
                <img src="/res/next-btn.svg" alt="next" className="cursor-pointer w-8 rounded-full drop-shadow-sm drop-shadow-gray-300" />

                <div className="absolute flex gap-0.5 right-15 items-center">
                    <img src={handleVolumeIcon()} alt="vol" onClick={toggleMute} className="cursor-pointer w-[20px] h-[20px]"/>
                    <input type="range" min={0} max={100} onChange={handVolumeSeek} value={volume}
                    style={{
                        background: `linear-gradient(to right, black 0%, black ${(volume / 100) * 100}%, #e5e7eb ${(volume / 100) * 100}%, #e5e7eb 100%)`
                    }}
                    className="w-[60px] appearance-none h-[3px] rounded-full cursor-pointer transition-all
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-[10px]
                        [&::-webkit-slider-thumb]:w-[10px]
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-[2px]
                        [&::-webkit-slider-thumb]:border-black
                        [&::-webkit-slider-thumb]:shadow-md
                    "/>
                </div>
            </div>

        </div>
    )
}