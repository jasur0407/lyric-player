import { useEffect, useRef } from "react"

type Props = {
    onTimeUpdate: (time: number) => void
}

export default function AudioPlayer({onTimeUpdate} : Props) {
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const update = () => onTimeUpdate(audio.currentTime)

        audio.addEventListener("timeupdate", update)

        return () => audio.removeEventListener("timeupdate", update)
    }, [onTimeUpdate])

    return (
        <audio controls src="/song.mp3" ref={audioRef}></audio>
    )
}