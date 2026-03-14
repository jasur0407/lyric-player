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
    measure.style.position = "absolute"; // Keeps it out of the document flow
    
    // CRITICAL: Apply the same font classes to the measurement tool
    measure.className = "italianno-regular text-3xl"; 

    document.body.appendChild(measure);

    words.forEach((word) => {
      // We join with two spaces to match your justify-between spacing feel
      measure.innerText = [...currentLine, word].join("  ");
      
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
    <div ref={containerRef} style={{ width }} className='text-white-700 italianno-regular text-3xl'>
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
