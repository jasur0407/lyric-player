import whisperx
import subprocess
import json
import os
import sys


# ─── CONFIG ──────────────────────────────────────────────
AUDIO_FILE  = "song.m4a"       # your input song
LYRICS_FILE = "lyrics.txt"     # your lyrics as plain text
OUTPUT_DIR  = "output"
DEVICE      = "cpu"            # change to "cuda" if you have a GPU
COMPUTE     = "int8"           # int8 = faster on CPU, float16 = better on GPU
MODEL_SIZE  = "medium"           # tiny / base / small / medium / large-v2
# ─────────────────────────────────────────────────────────

OFFSET_MS = 20  # adjust this value to taste

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── STEP 1: Separate vocals with Demucs ──────────────────
print("\n[1/4] Separating vocals with Demucs...")
vocals_path = os.path.join(OUTPUT_DIR, "htdemucs_ft",
              os.path.splitext(os.path.basename(AUDIO_FILE))[0], "vocals.wav")

if not os.path.exists(vocals_path):
    subprocess.run([
        "python", "-m", "demucs",
        "--two-stems=vocals",
        "-n", "htdemucs_ft",    # fine-tuned model, cleaner vocal separation
        "-o", OUTPUT_DIR,
        AUDIO_FILE
    ], check=True)
    print(f"  Vocals saved to: {vocals_path}")
else:
    print(f"  Vocals already exist, skipping. ({vocals_path})")

# ── STEP 2: Load audio + transcribe with WhisperX ────────
print("\n[2/4] Transcribing with WhisperX...")
model   = whisperx.load_model(MODEL_SIZE, DEVICE, compute_type=COMPUTE)
audio   = whisperx.load_audio(vocals_path)
result = model.transcribe(
    audio,
    batch_size=8,
    language="en",
    chunk_size=10,          # smaller chunks = better for fast delivery
    print_progress=True,    # so you can see it working
)
print(f"  Detected language: {result['language']}")
print(f"  Segments found: {len(result['segments'])}")

# ── STEP 3: Force-align to get word timestamps ───────────
print("\n[3/4] Running forced alignment...")
align_model, metadata = whisperx.load_align_model(
    language_code=result["language"],
    device=DEVICE
)
result = whisperx.align(
    result["segments"],
    align_model,
    metadata,
    audio,
    DEVICE,
    return_char_alignments=False
)

# ── STEP 4: Flatten into clean word list ─────────────────
print("\n[4/4] Extracting word timestamps...")
offset = OFFSET_MS / 1000  # convert ms to seconds

words = []
for segment in result["segments"]:
    for word in segment.get("words", []):
        if "start" in word and "end" in word:
            words.append({
                "word":  word["word"].strip(),
                "start": round(max(0, word["start"] - offset), 3),  # max(0) prevents negative timestamps
                "end":   round(max(0, word["end"] - offset), 3),
            })

# ── Save JSON output ──────────────────────────────────────
out_json = os.path.join(OUTPUT_DIR, "timestamps.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump({"words": words}, f, indent=2, ensure_ascii=False)

# ── Save LRC output (bonus — works in any lyrics app) ────
out_lrc = os.path.join(OUTPUT_DIR, "timestamps.lrc")
with open(out_lrc, "w", encoding="utf-8") as f:
    for w in words:
        mins  = int(w["start"] // 60)
        secs  = w["start"] % 60
        f.write(f"[{mins:02d}:{secs:06.3f}]{w['word']} ")

# ── Print a preview ───────────────────────────────────────
print(f"\n✅ Done! {len(words)} words aligned.\n")
print(f"  JSON → {out_json}")
print(f"  LRC  → {out_lrc}\n")
print("Preview (first 10 words):")
for w in words[:10]:
    print(f"  {w['start']:6.3f}s → {w['end']:6.3f}s   \"{w['word']}\"")