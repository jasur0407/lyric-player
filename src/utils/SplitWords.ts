export type WordTiming = {
    word: string,
    start: number
}

export function SplitWords(
  line: string,
  start: number,
  end: number,
  includeSpaces = true
): WordTiming[] {
  const words = line.trim() ? line.split(/\s+/) : [];
  if (words.length === 0) return [];

  const wordLengths = words.map((w) => w.length);
  const spacesCount = includeSpaces ? Math.max(0, words.length - 1) : 0;
  const totalChars = wordLengths.reduce((s, n) => s + n, 0) + spacesCount;
  const duration = Math.max(0, end - start);

  let elapsedChars = 0;
  return words.map((w, i) => {
    const offsetChars = elapsedChars + (includeSpaces ? i : 0);
    const startTime = start + (offsetChars / totalChars) * duration;
    elapsedChars += w.length;
    return { word: w, start: startTime };
  });
}