# Lyrics Sync App - Being developed

## Features

- Upload audio and lyrics files
- Upload background video
- Word-level timestamps alignment using WhisperX
- Custom fonts

## Stack
Frontend:
- React (Vite)
- CSS / Tailwind

Backend:
- Python
- WhisperX
- PyTorch

## How it works

1. Insert the music path and the lyrics into the Python code
2. Backend processes with WhisperX
3. Word-level timestamps are saved in the timestamps.json
4. Move the timestamps.json to the public/ folder as lyrics_sync.json
5. Run the React code using `npm run dev` to display UI

## Notes

The website is still being developed so some things may lack:
- `requirements.txt` for Python code
- Python code isn't efficient and timestamps are sometimes off from the actual timings
- Most things are pending to be done manually in source code
- UI isn't complete