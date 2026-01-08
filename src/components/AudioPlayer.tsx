import { useEffect, useRef, useState } from "react";

type Props = {
  onTimeUpdate: (time: number) => void;
};

export default function AudioPlayer({ onTimeUpdate }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => onTimeUpdate(audio.currentTime);
    audio.addEventListener("timeupdate", update);

    return () => audio.removeEventListener("timeupdate", update);
  }, [onTimeUpdate]);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;

          if (playing) {
            audio.pause();
          } else {
            audio.play();
          }

          setPlaying(!playing);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {playing ? "Pause" : "Play"}
      </button>

      <audio
        ref={audioRef}
        src="/song.mp3"
      />
    </div>
  );
}
