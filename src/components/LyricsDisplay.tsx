import { useState } from 'react'
import type { WordTiming } from '../utils/SplitWords'
import BratText from "./BratText"
import type { LyricLine } from '../utils/LRCseperate'

type Props = {
    words: WordTiming[],
    lines: LyricLine[],
    current: number
}

type allWords = {
    text: string,
    time: number
}


export default function LyricsDisplay({words, lines, current} : Props) {
    let bratAllText : string[][] = []
    const [mode, setMode] = useState<"word" | "line" | "brat">("word")

    const activeWordIndex = words.findIndex((w, i) => {
        const nextWordTime = words[i + 1]?.start ?? Infinity
        return w.start <= current && current < nextWordTime
    })

    const activeLineIndex = lines.findIndex((l, i) => {
        const nextLineTime = lines[i + 1]?.time ?? Infinity
        return l.time <= current && current < nextLineTime
    })

    const activeLine = lines[activeLineIndex] ?? null
    const activeWord = words[activeWordIndex]?.word ?? null


    const wordsByLine = lines.map((line, i) =>
        words.filter((w) => w.start >= line.time && w.start < (lines[i + 1]?.time ?? Infinity))
    )

    const lineWords = wordsByLine[activeLineIndex] ?? []
    const revealWordCount = lineWords.filter((w) => w.start <= current).length
    const revealWords = lineWords.slice(0, revealWordCount).map((w) => w.word).join(" ")



    return (
        <div>
            <h1>{current}</h1>
            <BratText text={revealWords}/>
        </div>
    )
}