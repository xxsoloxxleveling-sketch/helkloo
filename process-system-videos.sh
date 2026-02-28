#!/usr/bin/env bash
set -euo pipefail

# Run this script from the repository root in WSL, Git Bash, or any POSIX shell.
# Requires: ffmpeg, cwebp

RAW_DIR="assets/system-evolution/raw"
OUTPUT_DIR="public/frames/system-evolution"
OUTPUT_SM_DIR="public/frames-sm/system-evolution"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Missing dependency: ffmpeg"
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Missing dependency: cwebp"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "Merging clips into cinematic master..."
(
  cd "$RAW_DIR"
  cat > merge-runtime.txt << 'EOF'
file 'making-of-panel.mp4'
file 'panel-to-inverter.mp4'
file 'inverter-to-battery.mp4'
file 'battery-to-system.mp4'
EOF
  ffmpeg -y -f concat -safe 0 -i merge-runtime.txt -c copy system-evolution-master.mp4
  rm -f merge-runtime.txt
)

echo "Extracting 1920px PNG frames at 30fps..."
(
  cd "$RAW_DIR"
  rm -f frame_*.png
  ffmpeg -y -i system-evolution-master.mp4 -vf "fps=30,scale=1920:-1" -frames:v 600 frame_%04d.png
)

echo "Converting PNG -> WebP and moving to /$OUTPUT_DIR..."
rm -f "$OUTPUT_DIR"/frame_*.webp
for f in "$RAW_DIR"/frame_*.png; do
  name="$(basename "$f" .png)"
  cwebp -quiet -q 80 "$f" -o "$OUTPUT_DIR/${name}.webp"
done
rm -f "$RAW_DIR"/frame_*.png

if [[ "${1:-}" == "--mobile" ]]; then
  mkdir -p "$OUTPUT_SM_DIR"
  rm -f "$OUTPUT_SM_DIR"/frame_*.webp
  echo "Generating optional mobile sequence at 1280px..."
  (
    cd "$RAW_DIR"
    ffmpeg -y -i system-evolution-master.mp4 -vf "fps=30,scale=1280:-1" -frames:v 600 frame_%04d.webp
  )
  mv "$RAW_DIR"/frame_*.webp "$OUTPUT_SM_DIR"/
fi

echo "Done. Frames available at /$OUTPUT_DIR"
