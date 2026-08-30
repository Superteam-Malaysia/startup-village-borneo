#!/bin/bash
# Optimize loading video: convert MOV to WebM + MP4 (no audio) for web
# Requires: brew install ffmpeg
# Run from project root: ./scripts/optimize-loading-video.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INPUT="$PROJECT_ROOT/public/videos/0302(1).mov"
OUTPUT_DIR="$PROJECT_ROOT/public/videos"

if ! command -v ffmpeg &> /dev/null; then
  echo "FFmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Input video not found: $INPUT"
  exit 1
fi

echo "Optimizing loading video (no audio)..."
echo "Input: $INPUT"
echo ""

# Extract poster frame first (fast, used while video loads)
echo "Extracting poster frame..."
ffmpeg -y -i "$INPUT" -vframes 1 -q:v 2 \
  -loglevel error "$PROJECT_ROOT/public/images/loading-poster.jpg"

# MP4 (H.264) - broad compatibility, fallback for all browsers
echo "Converting to MP4 (H.264)..."
ffmpeg -y -i "$INPUT" -an -c:v libx264 -crf 23 -preset medium -movflags +faststart \
  -loglevel error "$OUTPUT_DIR/loading.mp4"

# WebM (VP9) - smaller file size for modern browsers
echo "Converting to WebM (VP9)..."
ffmpeg -y -i "$INPUT" -an -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -loglevel error "$OUTPUT_DIR/loading.webm"

echo ""
echo "Done! Generated:"
echo "  - public/videos/loading.mp4"
echo "  - public/videos/loading.webm"
echo "  - public/images/loading-poster.jpg"
