import { useRef, useState, useEffect } from 'react'

export default function BratText({ text = "", width = 100 }: { text?: string; width?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[][]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = text.trim() ? text.split(" ") : [];
    const temp: string[][] = [];
    let currentLine: string[] = [];

    const measure = document.createElement("span");
    measure.style.visibility = "hidden";
    measure.style.whiteSpace = "nowrap";
    document.body.appendChild(measure);

    words.forEach((word) => {
      measure.innerText = [...currentLine, word].join(" ");
      if (measure.offsetWidth > width && currentLine.length) {
        temp.push(currentLine);
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });

    if (currentLine.length) temp.push(currentLine);

    document.body.removeChild(measure);
    setLines(temp);
  }, [text, width]);

  return (
    <div ref={containerRef} style={{ width }}>
      {lines.map((line, i) => (
        <div key={i} className="flex justify-between">
          {line.map((word, j) => (
            <span key={j} className="whitespace-nowrap">
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
