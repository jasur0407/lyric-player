export type LyricLine = {
  time: number;
  text: string;
};

export function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split("\n");

  const result: LyricLine[] = [];

  for (const line of lines) {
    // Match [mm:ss.xx] text
    const match = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);

    if (!match) continue;

    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const text = match[3].trim();

    const time = minutes * 60 + seconds;

    result.push({ time, text });
  }

  return result;
}