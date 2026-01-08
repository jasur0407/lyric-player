import { useState } from "react";
import type { WordTiming } from "../utils/splitLineToWords";
import type { LyricLine } from "../utils/parseLRC";

type Props = {
  words: WordTiming[];
  lines: LyricLine[];
  currentTime: number;
};

export default function LyricsDisplay({ words, lines, currentTime }: Props) {
  const [viewMode, setViewMode] = useState<"word" | "line" | "brat">("word");
  const [follow, setFollow] = useState(true);
  const [manualLineIndex, setManualLineIndex] = useState(0);

  // Active word (by time)
  const activeWordIndex = words.findIndex((w, i) => {
    const nextStart = words[i + 1]?.start ?? Infinity;
    return currentTime >= w.start && currentTime < nextStart;
  });

  // Active line (by time)
  const activeLineIndexByTime = lines.findIndex((l, i) => {
    const next = lines[i + 1]?.time ?? Infinity;
    return currentTime >= l.time && currentTime < next;
  });

  const activeLineIndex = follow ? activeLineIndexByTime : manualLineIndex;
  const activeLine = activeLineIndex === -1 ? null : lines[activeLineIndex];

  // Word mode logic
  let displayedWord: string | null = null;

  if (viewMode === "word") {
    if (follow) {
      displayedWord =
        activeWordIndex === -1 ? null : words[activeWordIndex].word;
    } else if (activeLine) {
      const start = activeLine.time;
      const end = lines[activeLineIndex + 1]?.time ?? start + 5;
      const lineWords = words.filter(
        (w) => w.start >= start && w.start < end
      );
      displayedWord = lineWords[0]?.word ?? null;
    }
  }

  function prevLine() {
    setManualLineIndex((i) => Math.max(0, i - 1));
  }

  function nextLine() {
    setManualLineIndex((i) => Math.min(lines.length - 1, i + 1));
  }

  return (
    <div className="w-72 h-72 bg-black border border-black p-4 relative flex items-center justify-center">
      {/* Controls */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() =>
            setViewMode((m) =>
              m === "word" ? "line" : m === "line" ? "brat" : "word"
            )
          }
          className="px-2 py-1 bg-gray-800 text-sm rounded hover:bg-gray-700"
        >
          {viewMode}
        </button>

        {viewMode !== "brat" && (
          <button
            onClick={() => setFollow((f) => !f)}
            className={`px-2 py-1 text-sm rounded ${
              follow ? "bg-green-600" : "bg-gray-800"
            }`}
          >
            {follow ? "Follow" : "Manual"}
          </button>
        )}
      </div>

      {/* Manual nav */}
      {!follow && viewMode !== "brat" && (
        <div className="absolute bottom-2 left-4 right-4 flex justify-between">
          <button onClick={prevLine} className="px-3 py-1 bg-gray-800 rounded">
            Prev
          </button>
          <div className="text-sm text-gray-400">
            Line {manualLineIndex + 1} / {lines.length}
          </div>
          <button onClick={nextLine} className="px-3 py-1 bg-gray-800 rounded">
            Next
          </button>
        </div>
      )}

      {/* DISPLAY */}
      {viewMode === "word" && (
        <div className="text-2xl">
          {displayedWord ? (
            <span className="text-green-400 font-bold">
              {displayedWord}
            </span>
          ) : (
            <span className="text-gray-500">&mdash;</span>
          )}
        </div>
      )}

      {viewMode === "line" && (
        <div className="text-lg text-gray-300 text-center px-2">
          {activeLine ? activeLine.text : "—"}
        </div>
      )}

      {/* 🔥 BRAT MODE */}
      {viewMode === "brat" && (
        <div
          className="
            grid
            gap-y-3
            text-white
            text-[22px]
            leading-snug
            tracking-wide
            text-left
          "
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
