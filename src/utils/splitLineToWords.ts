export type WordTiming = {
  word: string;
  start: number;
};

export function splitLineToWords(
  text: string,
  startTime: number,
  endTime: number
): WordTiming[] {
  const words = text.split(" ").filter(Boolean);
  const duration = endTime - startTime;

  if (duration <= 0 || words.length === 0) return [];

  const wordDuration = duration / words.length;

  return words.map((word, index) => ({
    word,
    start: startTime + index * wordDuration,
  }));
}